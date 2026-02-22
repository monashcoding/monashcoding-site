export interface InstagramReel {
  url: string
  shortcode: string
  thumbnail: string
  caption: string
  date: string
  likes: string
  comments: string
  type: 'reel' | 'post'
  pinned?: boolean
}

/* ------------------------------------------------------------------ */
/*  Global in-memory cache (shared across all requests in the process) */
/* ------------------------------------------------------------------ */

interface CachedReel {
  data: InstagramReel
  fetchedAt: number
}

const cache = new Map<string, CachedReel>()
const CACHE_TTL = 60 * 60 * 1000 // 60 minutes
const REFRESH_INTERVAL = 60 * 60 * 1000 // 60 minutes

let refreshTimer: ReturnType<typeof setInterval> | null = null

function startBackgroundRefresh() {
  if (refreshTimer) return
  refreshTimer = setInterval(async () => {
    const urls = [...cache.keys()]
    if (urls.length === 0) return
    await Promise.allSettled(urls.map((url) => fetchAndCache(url)))
  }, REFRESH_INTERVAL)
  // Don't block process exit
  if (refreshTimer && typeof refreshTimer === 'object' && 'unref' in refreshTimer) {
    refreshTimer.unref()
  }
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetch metadata for Instagram reels/posts.
 * Returns cached data instantly if available; fetches on demand otherwise.
 * A background interval refreshes all cached entries every 60 minutes.
 */
export async function fetchInstagramReels(
  urls: string[]
): Promise<InstagramReel[]> {
  if (urls.length === 0) return []

  startBackgroundRefresh()

  const results = await Promise.allSettled(
    urls.map((url) => getOrFetch(url))
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<InstagramReel | null> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value)
    .filter((r): r is InstagramReel => r !== null)
}

/* ------------------------------------------------------------------ */
/*  Cache logic                                                        */
/* ------------------------------------------------------------------ */

async function getOrFetch(url: string): Promise<InstagramReel | null> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) {
    return cached.data
  }
  return fetchAndCache(url)
}

async function fetchAndCache(url: string): Promise<InstagramReel | null> {
  const reel = await fetchSingleReel(url)
  if (reel) {
    cache.set(url, { data: reel, fetchedAt: Date.now() })
  }
  return reel
}

/* ------------------------------------------------------------------ */
/*  Instagram scraping                                                 */
/* ------------------------------------------------------------------ */

async function fetchSingleReel(url: string): Promise<InstagramReel | null> {
  try {
    // Instagram only serves og: meta tags to known bot/crawler User-Agents.
    // A regular browser UA gets a JS-only app shell with no metadata.
    const res = await fetch(url, {
      headers: { 'User-Agent': 'facebookexternalhit/1.1' },
      cache: 'no-store',
    })
    if (!res.ok) return null

    const html = await res.text()
    const thumbnail = extractMetaContent(html, 'og:image')
    const description = extractMetaContent(html, 'og:description')

    if (!thumbnail) return null

    const shortcode = url.match(/\/(p|reel)\/([^/?]+)/)?.[2] ?? ''
    const type = url.includes('/reel/') ? 'reel' : 'post'
    const parsed = description ? parseOgDescription(description) : null

    return {
      url,
      shortcode,
      thumbnail: decodeHtmlEntities(thumbnail),
      caption: parsed?.caption ?? '',
      date: parsed?.date ?? '',
      likes: parsed?.likes ?? '0',
      comments: parsed?.comments ?? '0',
      type,
    }
  } catch {
    return null
  }
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(
    `<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']` +
      `|<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`
  )
  const match = html.match(regex)
  return match?.[1] ?? match?.[2] ?? null
}

function parseOgDescription(desc: string): {
  likes: string
  comments: string
  date: string
  caption: string
} {
  const decoded = decodeHtmlEntities(desc)
  // Format: "123 likes, 45 comments - username on Month Day, Year: "caption""
  const match = decoded.match(
    /^([\d,.\w]+)\s+likes?,\s*([\d,.\w]+)\s+comments?\s*-\s*\S+\s+on\s+(.+?):\s*(?:["\u201C])([\s\S]+?)(?:["\u201D])\.?\s*$/
  )
  if (match) {
    return {
      likes: match[1],
      comments: match[2],
      date: match[3],
      caption: match[4],
    }
  }
  return { likes: '0', comments: '0', date: '', caption: decoded }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16))
    )
    .replace(/&#(\d+);/g, (_, dec) =>
      String.fromCodePoint(parseInt(dec, 10))
    )
}
