import { getInstagramShortcode } from '@/lib/content/parsers'

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

/**
 * Fetch metadata for Instagram reels/posts by scraping og: meta tags.
 * Uses ISR caching (1 hour) matching the YouTube fetcher pattern.
 * Thumbnail CDN URLs expire, so they are refreshed on each revalidation.
 */
export async function fetchInstagramReels(
  urls: string[]
): Promise<InstagramReel[]> {
  if (urls.length === 0) return []

  const results = await Promise.allSettled(
    urls.map((url) => fetchSingleReel(url))
  )

  return results
    .filter(
      (r): r is PromiseFulfilledResult<InstagramReel | null> =>
        r.status === 'fulfilled'
    )
    .map((r) => r.value)
    .filter((r): r is InstagramReel => r !== null)
}

async function fetchSingleReel(url: string): Promise<InstagramReel | null> {
  try {
    // Instagram only serves og: meta tags to known bot/crawler User-Agents.
    // A regular browser UA gets a JS-only app shell with no metadata.
    const res = await fetch(url, {
      headers: { 'User-Agent': 'facebookexternalhit/1.1' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null

    const html = await res.text()
    const thumbnail = extractMetaContent(html, 'og:image')
    const description = extractMetaContent(html, 'og:description')

    if (!thumbnail) return null

    const shortcode = getInstagramShortcode(url) ?? ''
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

function extractMetaContent(html: string, property: string): string | null {
  // Match both attribute orderings:
  // <meta property="og:image" content="...">
  // <meta content="..." property="og:image">
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
  // Fallback: return the whole description as caption
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
