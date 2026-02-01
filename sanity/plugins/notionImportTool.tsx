'use client'

import { definePlugin, type Tool } from 'sanity'
import { UploadIcon } from '@sanity/icons'
import { useState, useCallback, useRef } from 'react'
import { useClient } from 'sanity'
import JSZip from 'jszip'
// heic2any is dynamically imported to avoid SSR issues (it references `window` at module level)

// --- Types ---

interface ParsedMember {
  name: string
  role: string
  team: string
  pastRoles?: string[]
  birthday?: string
  linkedIn?: string
  discordHandle?: string
  bentoMe?: string
  gender?: string
  mbti?: string
  isAlumni?: boolean
  firstDay?: string
  imageData?: { data: ArrayBuffer; filename: string; mimeType: string }
}

// --- Team slug mapping ---

// Used for both direct team name lookup (normalizeTeam) and substring matching in role titles (inferTeamFromRole)
const TEAM_SLUG_MAP: Record<string, string> = {
  management: 'management',
  president: 'management',
  secretary: 'management',
  treasurer: 'management',
  events: 'events',
  event: 'events',
  marketing: 'marketing',
  design: 'design',
  'human resources': 'human-resources',
  'people and culture': 'human-resources',
  sponsorship: 'sponsorship',
  sponsor: 'sponsorship',
  media: 'media',
  projects: 'projects',
  project: 'projects',
  outreach: 'outreach',
  infrastructure: 'projects',
}

function normalizeTeam(team: string): string | undefined {
  const lower = team.trim().toLowerCase()
  return TEAM_SLUG_MAP[lower]
}

// --- Infer team from a role string (e.g. "Events Director" -> "events") ---

// Management keywords take priority over other matches
const MANAGEMENT_KEYWORDS = ['president', 'secretary', 'treasurer', 'vice president']

function inferTeamFromRole(role: string): string | undefined {
  const lower = role.trim().toLowerCase()

  // Check management keywords first (they take priority)
  for (const keyword of MANAGEMENT_KEYWORDS) {
    if (lower.includes(keyword)) return 'management'
  }

  // Then check other team keywords
  for (const [keyword, slug] of Object.entries(TEAM_SLUG_MAP)) {
    if (lower.includes(keyword)) return slug
  }
  return undefined
}

// --- Bento.me URL normalization ---

function normalizeBentoUrl(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'bento.me/' || trimmed === 'https://bento.me/') return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('bento.me/')) return `https://${trimmed}`
  return `https://bento.me/${trimmed}`
}

// --- LinkedIn URL normalization ---

function normalizeLinkedIn(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'linkedin.com/in/' || trimmed === 'remove the "https://www."') return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('www.')) return `https://${trimmed}`
  if (trimmed.startsWith('linkedin.com')) return `https://www.${trimmed}`
  return `https://www.linkedin.com/in/${trimmed}`
}

// --- Birthday parsing (strip year) ---

function parseBirthday(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  // Notion CSV format: "May 14, 2026" — we strip the year
  const match = trimmed.match(/^(\w+)\s+(\d{1,2}),?\s*\d{0,4}$/)
  if (match) {
    return `${match[1]} ${match[2]}`
  }

  // Try DD/MM/YYYY format from body
  const dmyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/\d{2,4}$/)
  if (dmyMatch) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthIdx = parseInt(dmyMatch[2], 10) - 1
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${parseInt(dmyMatch[1], 10)}`
    }
  }

  return trimmed
}

// --- MBTI normalization ---

function parseMbti(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  // Extract just the 4-letter code, e.g. "INTP : Logician" -> "INTP"
  const match = trimmed.match(/^([A-Z]{4})/)
  if (match) return match[1]
  return trimmed
}

// --- CSV Parser ---

function parseCSVRow(row: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < row.length; i++) {
    const char = row[i]
    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < row.length && row[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  fields.push(current)
  return fields
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.split('\n').filter((l) => l.trim())
  if (lines.length < 2) return []

  // Remove BOM if present
  const headerLine = lines[0].replace(/^\uFEFF/, '')
  const headers = parseCSVRow(headerLine)
  const rows: Record<string, string>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i])
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] || '').trim()
    })
    rows.push(row)
  }

  return rows
}

// --- Normalize a raw first-day string into "27 Mar 2024" or "Mar 2024" ---

const MONTH_NAMES: Record<string, string> = {
  january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr',
  may: 'May', june: 'Jun', july: 'Jul', august: 'Aug',
  september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
  jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep',
  oct: 'Oct', nov: 'Nov', dec: 'Dec',
}

function normalizeFirstDay(raw: string): string | undefined {
  const s = raw.trim()
  if (!s) return undefined

  let day: number | undefined
  let month: string | undefined
  let year: number | undefined

  // Format: DD/MM/YYYY or D/M/YYYY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    day = parseInt(slashMatch[1], 10)
    const monthNum = parseInt(slashMatch[2], 10)
    year = parseInt(slashMatch[3], 10)
    const monthKeys = Object.keys(MONTH_NAMES).filter((k) => k.length > 3)
    if (monthNum >= 1 && monthNum <= 12) {
      month = MONTH_NAMES[monthKeys[monthNum - 1]]
    }
  }

  // Format: "27 March 2020", "27 Mar 2020", "3 October 2024"
  if (!month) {
    const dayFirstMatch = s.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/)
    if (dayFirstMatch) {
      day = parseInt(dayFirstMatch[1], 10)
      month = MONTH_NAMES[dayFirstMatch[2].toLowerCase()]
      year = parseInt(dayFirstMatch[3], 10)
    }
  }

  // Format: "March 27, 2020" or "Mar 27 2020"
  if (!month) {
    const monthFirstMatch = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
    if (monthFirstMatch) {
      month = MONTH_NAMES[monthFirstMatch[1].toLowerCase()]
      day = parseInt(monthFirstMatch[2], 10)
      year = parseInt(monthFirstMatch[3], 10)
    }
  }

  // Format: "October 2020" or "Mar 2024" (month + year only, no day)
  if (!month) {
    const monthYearMatch = s.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYearMatch) {
      month = MONTH_NAMES[monthYearMatch[1].toLowerCase()]
      year = parseInt(monthYearMatch[2], 10)
      day = undefined
    }
  }

  // Validate
  if (!month || !year || year < 1900 || year > 2100) return undefined
  if (day !== undefined && (day < 1 || day > 31)) return undefined

  return day ? `${day} ${month} ${year}` : `${month} ${year}`
}

// --- Parse first day from .md body ---

function parseFirstDayFromMd(content: string): string | undefined {
  // Look for **First Day**: or **First day**: pattern
  const match = content.match(/\*\*First [Dd]ay\*\*\s*:\s*(.+)/i)
  if (match) {
    const val = match[1].trim()
    if (val && val !== '' && val.length < 50) return normalizeFirstDay(val)
  }
  return undefined
}

// --- Parse all image references from .md ---

function parseImagesFromMd(content: string): string[] {
  // Match all ![...](path) patterns
  const regex = /!\[.*?\]\(([^)]+)\)/g
  const images: string[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    images.push(match[1]) // Keep encoded, we'll decode later
  }
  return images
}

// --- Get MIME type from filename ---

function getMimeType(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    case 'heic':
    case 'heif':
      return 'image/heic'
    default:
      return 'image/jpeg'
  }
}

// --- Check if file is HEIC format ---

function isHeicFile(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase()
  return ext === 'heic' || ext === 'heif'
}

// --- Convert HEIC to JPEG ---

async function convertHeicToJpeg(data: ArrayBuffer, filename: string): Promise<{ data: ArrayBuffer; filename: string; mimeType: string }> {
  const blob = new Blob([data], { type: 'image/heic' })
  const { default: heic2any } = await import('heic2any')
  const converted = await heic2any({
    blob,
    toType: 'image/jpeg',
    quality: 0.9,
  })
  // heic2any can return a single blob or array of blobs
  const resultBlob = Array.isArray(converted) ? converted[0] : converted
  const newData = await resultBlob.arrayBuffer()
  const newFilename = filename.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')
  return { data: newData, filename: newFilename, mimeType: 'image/jpeg' }
}

// --- Main parse function ---

async function parseNotionZip(file: File): Promise<ParsedMember[]> {
  const arrayBuffer = await file.arrayBuffer()
  let zip = await JSZip.loadAsync(arrayBuffer)

  // Handle nested zip (zip inside zip)
  const entries = Object.keys(zip.files)
  const innerZipEntry = entries.find((name) => name.endsWith('.zip'))
  if (innerZipEntry) {
    const innerData = await zip.files[innerZipEntry].async('arraybuffer')
    zip = await JSZip.loadAsync(innerData)
  }

  // Find the CSV file (use the first one, not the _all.csv)
  const csvEntry = Object.keys(zip.files).find(
    (name) => name.endsWith('.csv') && !name.endsWith('_all.csv')
  )

  if (!csvEntry) {
    throw new Error('No CSV file found in the zip. Expected a Notion export with a Committee Directory CSV.')
  }

  const csvContent = await zip.files[csvEntry].async('string')
  const rows = parseCSV(csvContent)

  // Build a map of .md files and image folders
  const mdFiles: Record<string, string> = {}
  const allFiles = Object.keys(zip.files)

  for (const path of allFiles) {
    if (path.endsWith('.md') && path.includes('Committee Directory/')) {
      const content = await zip.files[path].async('string')
      // Extract the name from the filename (e.g. "Ryan Nguyen 00ac01909b2b457a92b71ddbae03645f.md" -> "Ryan Nguyen")
      const basename = path.split('/').pop() || ''
      const nameFromFile = basename.replace(/\s+[a-f0-9]{32}\.md$/, '')
      mdFiles[nameFromFile] = content
    }
  }

  const members: ParsedMember[] = []

  for (const row of rows) {
    const name = row['Name']?.trim()
    const role = row['Current MAC Role']?.trim()
    const team = row['Team']?.trim()

    // Skip empty rows, templates, and entries without a name
    if (!name || name === 'Profile Template') continue
    // Skip entries without a role
    if (!role) continue

    const isAlumni = team?.toLowerCase() === 'alumni'
    let teamSlug = isAlumni ? undefined : normalizeTeam(team || '')

    // If no team resolved, try to infer from current role
    if (!teamSlug && role) {
      teamSlug = inferTeamFromRole(role)
    }

    // Parse past roles from CSV (comma-separated)
    const pastRolesRaw = row['Past Roles']?.trim()
    const pastRoles = pastRolesRaw
      ? pastRolesRaw.split(',').map((r) => r.trim()).filter(Boolean)
      : undefined

    // If still no team resolved, infer from past roles
    // Priority: management > director role > most recent match
    if (!teamSlug && pastRoles?.length) {
      let directorTeam: string | undefined
      let firstMatch: string | undefined

      for (const pastRole of pastRoles) {
        const inferred = inferTeamFromRole(pastRole)
        if (!inferred) continue

        if (inferred === 'management') {
          teamSlug = 'management'
          break
        }
        if (!directorTeam && /director/i.test(pastRole)) {
          directorTeam = inferred
        }
        if (!firstMatch) {
          firstMatch = inferred
        }
      }

      if (!teamSlug) {
        teamSlug = directorTeam || firstMatch
      }
    }

    // Parse fields
    const birthday = parseBirthday(row['Birthday'] || '')
    const linkedIn = normalizeLinkedIn(row['LinkedIn'] || '')
    const discordHandle = row['Discord Handle']?.trim() || undefined
    const bentoMe = normalizeBentoUrl(row['Bento.me'] || '')
    const gender = row['Gender']?.trim() || undefined
    const mbti = parseMbti(row['MBTI'] || '')

    // Find the corresponding .md file for firstDay and image
    const mdContent = mdFiles[name]
    const firstDay = mdContent ? parseFirstDayFromMd(mdContent) : undefined

    // Find the first usable image from the .md file
    let imageData: ParsedMember['imageData'] = undefined
    if (mdContent) {
      const imagePaths = parseImagesFromMd(mdContent)

      // Try each image in order until we find one that works
      for (const imagePath of imagePaths) {
        if (imageData) break // Already found a working image

        // The image path in .md is relative to the member's folder
        // e.g. "Rafael%20Enrique%20Abes/IMG_6457.heic" - look for IMG_6457.heic in a folder starting with "Rafael Enrique Abes"
        const decodedImagePath = decodeURIComponent(imagePath)
        const imageFilename = decodedImagePath.split('/').pop() || ''
        const folderHint = decodedImagePath.split('/')[0] || '' // e.g. "Rafael Enrique Abes"

        // Try to find the image in the zip
        // Note: Notion exports have folders with hash suffixes like "Rafael Enrique Abes a7cc9e4f97364c1c87515935e6898747"
        // but the md file references just "Rafael Enrique Abes/IMG_6457.heic"
        const possiblePaths = [
          // Direct path (unlikely to work due to hash suffix)
          `Private & Shared/Committee Directory/${decodedImagePath}`,
          // Match by filename in folder that STARTS WITH the folder hint (handles hash suffix)
          ...allFiles.filter((f) => {
            if (!f.endsWith(imageFilename)) return false
            const parts = f.split('/')
            const folderName = parts[parts.length - 2] || ''
            return folderHint && folderName.startsWith(folderHint)
          }),
          // Match by filename in any folder containing the member's name
          ...allFiles.filter((f) => f.endsWith(imageFilename) && f.includes(name)),
          // Last resort: just match by exact filename anywhere in Committee Directory
          ...allFiles.filter((f) => f.includes('Committee Directory') && f.endsWith(imageFilename)),
        ]

        for (const tryPath of possiblePaths) {
          const imageFile = zip.files[tryPath]
          if (imageFile && !imageFile.dir) {
            const data = await imageFile.async('arraybuffer')
            const filename = tryPath.split('/').pop() || 'photo.jpg'

            // Convert HEIC to JPEG if necessary
            if (isHeicFile(filename)) {
              try {
                imageData = await convertHeicToJpeg(data, filename)
              } catch (err) {
                console.warn(`Failed to convert HEIC for ${name}, trying next image...`)
                // Don't break - try the next image path instead
              }
            } else {
              imageData = { data, filename, mimeType: getMimeType(filename) }
            }
            if (imageData) break
          }
        }
      }
    }

    members.push({
      name,
      role,
      team: teamSlug || '',
      isAlumni: isAlumni || undefined,
      pastRoles: pastRoles?.length ? pastRoles : undefined,
      birthday,
      linkedIn,
      discordHandle,
      bentoMe,
      gender,
      mbti,
      firstDay,
      imageData,
    })
  }

  return members
}

// --- Studio Tool Component ---

function NotionImportToolComponent() {
  const client = useClient({ apiVersion: '2024-01-18' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'previewing' | 'importing' | 'done' | 'error'>('idle')
  const [members, setMembers] = useState<ParsedMember[]>([])
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [importCount, setImportCount] = useState(0)
  const [existingMode, setExistingMode] = useState<'skip' | 'replace'>('replace')

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('parsing')
    setError('')
    setProgress('Reading zip file...')

    try {
      const parsed = await parseNotionZip(file)
      setMembers(parsed)
      setStatus('previewing')
      setProgress(`Found ${parsed.length} members. Review and click Import to proceed.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse zip file')
      setStatus('error')
    }
  }, [])

  const handleImport = useCallback(async () => {
    setStatus('importing')
    setImportCount(0)

    let created = 0
    let updated = 0
    let skipped = 0

    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      setProgress(`Importing ${i + 1}/${members.length}: ${member.name}...`)

      try {
        // Check if member already exists
        const existingDoc = await client.fetch<{ _id: string } | null>(
          `*[_type == "committeeMember" && name == $name][0]{ _id }`,
          { name: member.name }
        )

        if (existingDoc && existingMode === 'skip') {
          skipped++
          setImportCount(created + updated)
          continue
        }

        // Upload image if present
        let photoAsset: { _type: string; _ref: string } | undefined
        if (member.imageData) {
          try {
            const blob = new Blob([member.imageData.data], { type: member.imageData.mimeType })
            const asset = await client.assets.upload('image', blob, {
              filename: member.imageData.filename,
            })
            photoAsset = { _type: 'reference', _ref: asset._id }
          } catch {
            // If image upload fails, continue without photo
            console.warn(`Failed to upload photo for ${member.name}`)
          }
        }

        // Build the fields
        const fields: Record<string, unknown> = {
          name: member.name,
          role: member.role,
        }

        if (member.team) fields.team = member.team
        if (member.isAlumni) fields.isAlumni = true
        if (member.pastRoles) fields.pastRoles = member.pastRoles
        if (member.birthday) fields.birthday = member.birthday
        if (member.linkedIn) fields.linkedIn = member.linkedIn
        if (member.discordHandle) fields.discordHandle = member.discordHandle
        if (member.bentoMe) fields.bentoMe = member.bentoMe
        if (member.gender) fields.gender = member.gender
        if (member.mbti) fields.mbti = member.mbti
        if (member.firstDay) fields.firstDay = member.firstDay
        if (photoAsset) {
          fields.photo = {
            _type: 'image',
            asset: photoAsset,
            alt: member.name,
          }
        }

        if (existingDoc && existingMode === 'replace') {
          // Patch the existing document
          await client.patch(existingDoc._id).set(fields).commit()
          updated++
        } else {
          // Create a new document
          await client.create({ _type: 'committeeMember', ...fields })
          created++
        }

        setImportCount(created + updated)
      } catch (err) {
        console.error(`Failed to import ${member.name}:`, err)
      }
    }

    setStatus('done')
    const parts: string[] = []
    if (created > 0) parts.push(`created ${created}`)
    if (updated > 0) parts.push(`updated ${updated}`)
    if (skipped > 0) parts.push(`skipped ${skipped}`)
    setProgress(`Import complete! ${parts.join(', ')} members.`)
  }, [members, client, existingMode])

  const handleReset = useCallback(() => {
    setStatus('idle')
    setMembers([])
    setProgress('')
    setError('')
    setImportCount(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Notion Committee Import
      </h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>
        Import committee members from a Notion export. Follow the steps below to export from Notion,
        then upload the zip file here.
      </p>

      {/* Export Instructions */}
      {(status === 'idle' || status === 'error') && (
        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            backgroundColor: '#1a1a2e',
            border: '1px solid #333',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: 1.7,
          }}
        >
          <strong style={{ display: 'block', marginBottom: '0.5rem' }}>How to export from Notion:</strong>
          <ol style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>On Notion, go to <strong>Home &gt; Committee Directory &gt; All</strong></li>
            <li>Click the <strong>...</strong> on the top right corner</li>
            <li>Click <strong>Export</strong></li>
            <li>
              Select the following options:
              <ul style={{ margin: '0.25rem 0', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
                <li>Export format: <strong>Markdown &amp; CSV</strong></li>
                <li>Include databases: <strong>Current view</strong></li>
                <li>Include content: <strong>Everything</strong></li>
                <li>Include subpages: <strong>Enabled</strong></li>
                <li>Create folders for subpages: <strong>Enabled</strong></li>
              </ul>
            </li>
            <li>Click <strong>Export</strong></li>
            <li>Upload the downloaded zip file below</li>
          </ol>
        </div>
      )}

      {/* File Input */}
      {(status === 'idle' || status === 'error') && (
        <div>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#2276fc',
              color: 'white',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            <UploadIcon />
            Select Zip File
            <input
              ref={fileInputRef}
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            color: '#dc2626',
          }}
        >
          {error}
        </div>
      )}

      {/* Parsing state */}
      {status === 'parsing' && (
        <div style={{ marginTop: '1rem', color: '#888' }}>{progress}</div>
      )}

      {/* Preview */}
      {status === 'previewing' && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.875rem' }}>
            <span style={{ color: '#aaa' }}>If member already exists:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="existingMode"
                checked={existingMode === 'replace'}
                onChange={() => setExistingMode('replace')}
              />
              Replace with new data
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="existingMode"
                checked={existingMode === 'skip'}
                onChange={() => setExistingMode('skip')}
              />
              Skip
            </label>
          </div>

          <div
            style={{
              maxHeight: 400,
              overflow: 'auto',
              border: '1px solid #333',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333', position: 'sticky', top: 0, background: '#1a1a1a' }}>
                  {['Name', 'Role', 'Team', 'Alumni', 'Past Roles', 'Photo', 'LinkedIn', 'Discord', 'Bento.me', 'Birthday', 'Gender', 'MBTI', 'First Day'].map((h) => (
                    <th key={h} style={{ padding: '0.4rem', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const empty = '\u2014'
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '0.3rem 0.4rem', whiteSpace: 'nowrap' }}>{m.name}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.role}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.team || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.isAlumni ? 'Yes' : empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.pastRoles ? m.pastRoles.join(', ') : empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.imageData ? '\u2713' : empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.linkedIn || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.discordHandle || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.bentoMe || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.birthday || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.gender || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.mbti || empty}</td>
                      <td style={{ padding: '0.3rem 0.4rem' }}>{m.firstDay || empty}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p style={{ color: '#888', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {progress}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleImport}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.9rem',
              }}
            >
              Import {members.length} Members
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#333',
                color: 'white',
                border: '1px solid #555',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Importing */}
      {status === 'importing' && (
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ marginBottom: '0.75rem', color: '#888' }}>{progress}</div>
          <div
            style={{
              width: '100%',
              height: 8,
              backgroundColor: '#333',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${((importCount / members.length) * 100).toFixed(1)}%`,
                height: '100%',
                backgroundColor: '#2276fc',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.8rem' }}>
            {importCount} / {members.length} imported
          </p>
        </div>
      )}

      {/* Done */}
      {status === 'done' && (
        <div style={{ marginTop: '1.5rem' }}>
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#052e16',
              border: '1px solid #166534',
              borderRadius: '0.375rem',
              color: '#4ade80',
              marginBottom: '1rem',
            }}
          >
            {progress}
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#333',
              color: 'white',
              border: '1px solid #555',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  )
}

// --- Plugin Definition ---

const notionImportTool: Tool = {
  name: 'notion-import',
  title: 'Notion Import',
  icon: UploadIcon,
  component: NotionImportToolComponent,
}

export const notionImportPlugin = definePlugin({
  name: 'notion-import',
  tools: [notionImportTool],
})
