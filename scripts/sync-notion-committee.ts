/**
 * Syncs committee members from the Notion "Committee Directory" database into Sanity.
 *
 * Usage:
 *   npm run sync:committee             # apply changes
 *   npm run sync:committee -- --dry-run
 *
 * Requires NOTION_TOKEN (read access to the Committee Directory database),
 * SANITY_API_TOKEN (Editor) and the usual Sanity project/dataset environment variables.
 * With SANITY_WEBHOOK_SECRET set, a run that changed anything also calls the site's
 * /api/revalidate route (REVALIDATE_URL overrides the default).
 *
 * Members are matched by Notion page id (stored as notionId), falling back to name for
 * documents created before the sync existed. Pages whose last_edited_time matches the
 * stored notionEditedAt are skipped. Documents are never deleted, and bio, email and
 * bentoMe are left alone because Notion has no source for them.
 */

import convertHeic from 'heic-convert'
import {
  normalizeFirstDay,
  normalizeLinkedIn,
  parseBirthday,
  parseMbti,
  resolveTeam,
} from '../lib/committee-import'

const NOTION_VERSION = '2022-06-28'
const SANITY_API_VERSION = 'v2024-01-18'
const DEFAULT_DATABASE_ID = '40ef5506-e46b-4f61-96fd-8f4aa8dcb4a6'
const NOTION_MIN_INTERVAL_MS = 350

const notionToken = process.env.NOTION_TOKEN
const databaseId = process.env.NOTION_COMMITTEE_DATABASE_ID || DEFAULT_DATABASE_ID
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET
const sanityToken = process.env.SANITY_API_TOKEN
const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
const revalidateUrl = process.env.REVALIDATE_URL || 'https://www.monashcoding.com/api/revalidate'
const dryRun = process.argv.includes('--dry-run')

if (!notionToken || !projectId || !dataset || !sanityToken) {
  console.error('Missing NOTION_TOKEN, SANITY_API_TOKEN, or Sanity project/dataset environment variables')
  process.exit(1)
}

// --- Types ---

type RichText = { plain_text: string }[]

interface NotionPage {
  id: string
  last_edited_time: string
  archived?: boolean
  in_trash?: boolean
  properties: Record<string, any>
}

interface NotionBlock {
  id: string
  type: string
  has_children: boolean
  [key: string]: any
}

interface SanityMember {
  _id: string
  name?: string
  role?: string
  team?: string
  isAlumni?: boolean
  pastRoles?: string[]
  birthday?: string
  linkedIn?: string
  discordHandle?: string
  gender?: string
  mbti?: string
  firstDay?: string
  notionId?: string
  notionEditedAt?: string
  notionPhoto?: string
  hasPhoto: boolean
  hasDraft: boolean
}

interface PhotoCandidate {
  key: string
  url: string
}

const MANAGED_FIELDS = [
  'name',
  'role',
  'team',
  'isAlumni',
  'pastRoles',
  'birthday',
  'linkedIn',
  'discordHandle',
  'gender',
  'mbti',
  'firstDay',
] as const

type ManagedFields = Partial<Record<(typeof MANAGED_FIELDS)[number], unknown>>

// --- Notion API ---

let lastNotionRequest = 0

async function notion<T>(path: string, init: RequestInit = {}, attempt = 0): Promise<T> {
  const wait = lastNotionRequest + NOTION_MIN_INTERVAL_MS - Date.now()
  if (wait > 0) await sleep(wait)
  lastNotionRequest = Date.now()

  let res: Response
  try {
    res = await fetch(`https://api.notion.com/v1${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
    })
  } catch (err) {
    if (attempt >= 5) throw err
    await sleep(2 ** attempt * 1000)
    return notion(path, init, attempt + 1)
  }

  if ((res.status === 429 || res.status >= 500) && attempt < 5) {
    const retryAfter = Number(res.headers.get('retry-after')) || 2 ** attempt
    await sleep(retryAfter * 1000)
    return notion(path, init, attempt + 1)
  }
  if (!res.ok) {
    throw new Error(`Notion ${path} failed: ${res.status} ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

async function queryAllPages(): Promise<NotionPage[]> {
  const pages: NotionPage[] = []
  let cursor: string | undefined
  do {
    const res = await notion<{ results: NotionPage[]; has_more: boolean; next_cursor: string | null }>(
      `/databases/${databaseId}/query`,
      { method: 'POST', body: JSON.stringify({ page_size: 100, start_cursor: cursor }) }
    )
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined
  } while (cursor)
  return pages.filter((p) => !p.archived && !p.in_trash)
}

async function listChildren(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined
  do {
    const query = new URLSearchParams({ page_size: '100' })
    if (cursor) query.set('start_cursor', cursor)
    const res = await notion<{ results: NotionBlock[]; has_more: boolean; next_cursor: string | null }>(
      `/blocks/${blockId}/children?${query}`
    )
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor ?? undefined : undefined
  } while (cursor)
  return blocks
}

// Walks the page body in document order, the same order a Markdown export uses
async function readPageBody(pageId: string): Promise<{ firstDay?: string; photos: PhotoCandidate[] }> {
  const photos: PhotoCandidate[] = []
  let firstDay: string | undefined

  const walk = async (blockId: string) => {
    for (const block of await listChildren(blockId)) {
      if (block.type === 'image') {
        const image = block.image
        const url: string | undefined = image?.type === 'file' ? image.file?.url : image?.external?.url
        if (url) {
          // Notion file URLs are re-signed on every request; the path identifies the upload
          const key = image.type === 'file' ? new URL(url).pathname : url
          photos.push({ key, url })
        }
      }

      if (!firstDay) {
        const text = plainText(block[block.type]?.rich_text)
        const match = text.match(/^\s*First [Dd]ay\s*:\s*(.+)$/)
        if (match && match[1].trim().length < 50) {
          firstDay = normalizeFirstDay(match[1].trim())
        }
      }

      if (block.has_children && block.type !== 'child_page' && block.type !== 'child_database') {
        await walk(block.id)
      }
    }
  }

  await walk(pageId)
  return { firstDay, photos }
}

// --- Notion property readers ---

function plainText(rich: RichText | undefined): string {
  return (rich || []).map((t) => t.plain_text).join('')
}

function titleOf(page: NotionPage, key: string): string {
  return plainText(page.properties[key]?.title).trim()
}

function textOf(page: NotionPage, key: string): string {
  return plainText(page.properties[key]?.rich_text).trim()
}

function selectOf(page: NotionPage, key: string): string {
  return page.properties[key]?.select?.name?.trim() || ''
}

function multiSelectOf(page: NotionPage, key: string): string[] {
  return (page.properties[key]?.multi_select || []).map((o: { name: string }) => o.name.trim()).filter(Boolean)
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

// Notion dates come back as "2003-04-22"; the site only shows "April 22".
// Many members only have the year-less "Birthday Bot" date filled in.
function birthdayOf(page: NotionPage): string | undefined {
  const start: string | undefined =
    page.properties['Birthday']?.date?.start || page.properties['Birthday Bot']?.date?.start
  const match = start?.match(/^\d{4}-(\d{2})-(\d{2})/)
  if (!match) return undefined
  return parseBirthday(`${MONTHS[parseInt(match[1], 10) - 1]} ${parseInt(match[2], 10)}`)
}

function fieldsFromPage(page: NotionPage, firstDay: string | undefined): ManagedFields {
  const role = selectOf(page, 'Current MAC Role')
  const pastRoles = multiSelectOf(page, 'Past Roles')
  const gender = multiSelectOf(page, 'Gender').join(', ')

  return {
    name: titleOf(page, 'Name'),
    role,
    team: resolveTeam(multiSelectOf(page, 'Team'), role, pastRoles),
    isAlumni: role.toLowerCase() === 'alumni' || undefined,
    pastRoles: pastRoles.length ? pastRoles : undefined,
    birthday: birthdayOf(page),
    linkedIn: normalizeLinkedIn(page.properties['LinkedIn']?.url || ''),
    discordHandle: textOf(page, 'Discord Handle') || undefined,
    gender: gender || undefined,
    mbti: parseMbti(selectOf(page, 'MBTI')),
    firstDay,
  }
}

// --- Sanity API ---

const sanityBase = `https://${projectId}.api.sanity.io/${SANITY_API_VERSION}`

async function sanity<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${sanityBase}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${sanityToken}`, ...(init.headers || {}) },
  })
  if (!res.ok) {
    throw new Error(`Sanity ${path} failed: ${res.status} ${await res.text()}`)
  }
  return res.json() as Promise<T>
}

async function fetchMembers(): Promise<SanityMember[]> {
  const query = `*[_type == "committeeMember" && !(_id in path("drafts.**"))]{
    _id, name, role, team, isAlumni, pastRoles, birthday, linkedIn, discordHandle, gender, mbti, firstDay,
    notionId, notionEditedAt, notionPhoto,
    "hasPhoto": defined(photo.asset),
    "hasDraft": defined(*[_id == "drafts." + ^._id][0]._id)
  }`
  const res = await sanity<{ result: SanityMember[] }>(`/data/query/${dataset}?query=${encodeURIComponent(query)}`)
  return res.result
}

async function mutate(mutations: unknown[]): Promise<void> {
  await sanity(`/data/mutate/${dataset}?visibility=sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mutations }),
  })
}

async function uploadImage(data: Uint8Array<ArrayBuffer>, filename: string, contentType: string): Promise<string> {
  const res = await sanity<{ document: { _id: string } }>(
    `/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`,
    { method: 'POST', headers: { 'Content-Type': contentType }, body: data }
  )
  return res.document._id
}

// --- Photos ---

const HEIC_BRANDS = new Set(['heic', 'heix', 'hevc', 'hevx', 'heim', 'heis', 'hevm', 'hevs', 'mif1', 'msf1'])

function isHeic(data: Uint8Array): boolean {
  if (data.length < 12) return false
  const box = String.fromCharCode(...data.subarray(4, 8))
  const brand = String.fromCharCode(...data.subarray(8, 12))
  return box === 'ftyp' && HEIC_BRANDS.has(brand)
}

// Notion's file host sometimes sends a bare "image" content type, so detect it from the bytes
function sniffImageType(data: Uint8Array): string | undefined {
  const ascii = (start: number, end: number) => String.fromCharCode(...data.subarray(start, end))
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return 'image/jpeg'
  if (ascii(0, 8) === '\x89PNG\r\n\x1a\n') return 'image/png'
  if (ascii(0, 4) === 'GIF8') return 'image/gif'
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp'
  return undefined
}

async function downloadPhoto(
  candidate: PhotoCandidate
): Promise<{ data: Uint8Array<ArrayBuffer>; filename: string; contentType: string } | undefined> {
  const res = await fetch(candidate.url)
  if (!res.ok) return undefined

  let data = new Uint8Array(await res.arrayBuffer())
  let filename = decodeURIComponent(new URL(candidate.url).pathname.split('/').pop() || 'photo.jpg')

  if (isHeic(data)) {
    const jpeg = await convertHeic({ buffer: data, format: 'JPEG', quality: 0.9 })
    data = new Uint8Array(jpeg)
    filename = filename.replace(/\.(heic|heif)$/i, '') + '.jpg'
  }

  const contentType = sniffImageType(data)
  if (!contentType) return undefined
  return { data, filename, contentType }
}

// --- Sync ---

function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLowerCase()
}

// isAlumni defaults to false in the Studio, which means the same as unset
function sameValue(a: unknown, b: unknown): boolean {
  const normalize = (v: unknown) => JSON.stringify(v === false ? null : v ?? null)
  return normalize(a) === normalize(b)
}

function describe(value: unknown): string {
  if (value === undefined || value === null) return '(empty)'
  return Array.isArray(value) ? `[${value.join(', ')}]` : String(value)
}

async function main() {
  const [pages, members] = await Promise.all([queryAllPages(), fetchMembers()])
  console.log(`${dryRun ? '[dry run] ' : ''}${pages.length} Notion pages, ${members.length} Sanity members`)

  const byNotionId = new Map(members.filter((m) => m.notionId).map((m) => [m.notionId!, m]))
  const byName = new Map<string, SanityMember>()
  for (const m of members) {
    if (m.notionId || !m.name) continue
    const key = normalizeName(m.name)
    if (byName.has(key)) console.warn(`Duplicate Sanity member name, matching the first: ${m.name}`)
    else byName.set(key, m)
  }

  const matched = new Set<string>()
  const counts = { created: 0, updated: 0, unchanged: 0, skipped: 0, failed: 0 }

  for (const page of pages) {
    const name = titleOf(page, 'Name')
    const role = selectOf(page, 'Current MAC Role')
    if (!name || name === 'Profile Template' || !role) {
      counts.skipped++
      continue
    }

    const existing = byNotionId.get(page.id) ?? byName.get(normalizeName(name))
    if (existing) {
      matched.add(existing._id)
      byName.delete(normalizeName(name))
    }
    if (existing?.notionId === page.id && existing.notionEditedAt === page.last_edited_time) {
      counts.unchanged++
      continue
    }

    try {
      const body = await readPageBody(page.id)
      const fields = fieldsFromPage(page, body.firstDay)

      const set: Record<string, unknown> = {}
      const unset: string[] = []
      const changes: string[] = []
      for (const key of MANAGED_FIELDS) {
        const next = fields[key]
        const prev = existing?.[key]
        if (sameValue(next, prev)) continue
        // A team that can't be resolved keeps whatever was set in the Studio
        if (key === 'team' && next === undefined) continue
        // Only clear a first day that isn't a date at all (left over from older imports)
        if (key === 'firstDay' && next === undefined && typeof prev === 'string' && normalizeFirstDay(prev)) continue
        if (next === undefined) unset.push(key)
        else set[key] = next
        changes.push(`${key}: ${describe(prev)} -> ${describe(next)}`)
      }

      const photo = body.photos.find((p) => p.key === existing?.notionPhoto) ?? body.photos[0]
      const photoChanged = !!photo && (photo.key !== existing?.notionPhoto || !existing?.hasPhoto)
      const photoChange = existing?.hasPhoto ? 'photo: replaced' : 'photo: added'

      const label = existing ? `update ${name}` : `create ${name}`
      if (existing?.hasDraft && changes.length) {
        console.warn(`${name} has an unpublished draft in the Studio; publishing it will overwrite this sync`)
      }

      if (dryRun) {
        if (photoChanged) changes.push(photoChange)
        if (changes.length) console.log(`${label}\n  ${changes.join('\n  ')}`)
        if (existing && !changes.length) counts.unchanged++
        else if (existing) counts.updated++
        else counts.created++
        continue
      }

      if (photoChanged) {
        const candidates = [photo, ...body.photos.filter((p) => p !== photo)]
        for (const candidate of candidates) {
          try {
            const download = await downloadPhoto(candidate)
            if (!download) continue
            const assetId = await uploadImage(download.data, download.filename, download.contentType)
            set.photo = { _type: 'image', asset: { _type: 'reference', _ref: assetId }, alt: name }
            set.notionPhoto = candidate.key
            changes.push(photoChange)
            break
          } catch (err) {
            console.warn(`Photo for ${name} failed, trying the next image: ${err}`)
          }
        }
      }

      set.notionId = page.id
      // Leaving notionEditedAt stale makes the next run retry a photo that failed to upload
      if (!photoChanged || set.photo) {
        set.notionEditedAt = page.last_edited_time
      } else {
        console.warn(`No usable photo for ${name}, will retry next run`)
      }

      if (existing) {
        const patch: Record<string, unknown> = { id: existing._id, set }
        if (unset.length) patch.unset = unset
        await mutate([{ patch }])
      } else {
        await mutate([{ createIfNotExists: { _id: `committee-notion-${page.id}`, _type: 'committeeMember', ...set } }])
      }

      if (changes.length) console.log(`${label}\n  ${changes.join('\n  ')}`)
      if (!existing) counts.created++
      else if (changes.length) counts.updated++
      else counts.unchanged++
    } catch (err) {
      counts.failed++
      console.error(`Failed to sync ${name}: ${err}`)
    }
  }

  const orphans = members.filter((m) => !matched.has(m._id))
  if (orphans.length) {
    console.log(`Not in Notion (left untouched): ${orphans.map((m) => m.name || m._id).join(', ')}`)
  }

  console.log(
    `${dryRun ? '[dry run] ' : ''}created ${counts.created}, updated ${counts.updated}, ` +
      `unchanged ${counts.unchanged}, skipped ${counts.skipped}, failed ${counts.failed}`
  )

  if (!dryRun && webhookSecret && (counts.created || counts.updated)) {
    await revalidate()
  }
  if (counts.failed) process.exit(1)
}

async function revalidate() {
  const res = await fetch(revalidateUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-sanity-webhook-secret': webhookSecret! },
    body: JSON.stringify({ _type: 'committeeMember' }),
  })
  if (!res.ok) {
    throw new Error(`Revalidate failed: ${res.status} ${await res.text()}`)
  }
  console.log('Revalidated the committeeMember tag')
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
