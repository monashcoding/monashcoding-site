const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID ?? 'UCxEz0QrpHJyLiWsVFgfUrRw'
const CHANNEL_HANDLE =
  process.env.YOUTUBE_CHANNEL_HANDLE ?? 'MonashAssociationofCoding'

export interface YouTubeVideo {
  videoId: string
  title: string
  published: string
  year: number
  thumbnail: string
  views: number
}

/**
 * Fetch long-form (non-Shorts) videos from the MAC YouTube channel.
 * Uses scriptbarrel.com proxy to get up to 50 videos (vs 15 from standard RSS).
 * Falls back to standard YouTube RSS if the proxy fails.
 * Shorts are filtered out by checking for `/shorts/` in the link URL.
 */
export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID

  // If a curated playlist is set, use standard RSS (playlist feeds are already focused)
  if (playlistId) {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
    return fetchAndParse(feedUrl)
  }

  // Try scriptbarrel proxy first (returns up to 50 videos)
  const proxyUrl = `https://scriptbarrel.com/xml.cgi?channel_id=${CHANNEL_ID}&name=%40${CHANNEL_HANDLE}`
  const videos = await fetchAndParse(proxyUrl)
  if (videos.length > 0) return videos

  // Fall back to standard YouTube RSS (15 video limit)
  const fallbackUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  return fetchAndParse(fallbackUrl)
}

async function fetchAndParse(feedUrl: string): Promise<YouTubeVideo[]> {
  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const xml = await res.text()
    return parseYouTubeFeed(xml)
  } catch {
    return []
  }
}

async function parseYouTubeFeed(xml: string): Promise<YouTubeVideo[]> {
  const entries = xml.split('<entry>').slice(1)
  const candidates: YouTubeVideo[] = []

  for (const entry of entries) {
    // If the feed has /shorts/ links (standard YouTube RSS), filter directly
    const linkMatch = entry.match(/<link rel="alternate" href="([^"]+)"/)
    const link = linkMatch?.[1] ?? ''
    if (link.includes('/shorts/')) continue

    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)</)
    const titleMatch = entry.match(/<title>([^<]+)</)
    const publishedMatch = entry.match(/<published>([^<]+)</)
    const viewsMatch = entry.match(/views="(\d+)"/)
    const thumbMatch = entry.match(/<media:thumbnail url="([^"]+)"/)

    const videoId = videoIdMatch?.[1]
    if (!videoId) continue

    const published = publishedMatch?.[1] ?? ''
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear()

    candidates.push({
      videoId,
      title: decodeXmlEntities(titleMatch?.[1] ?? 'Untitled'),
      published,
      year,
      thumbnail: thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      views: Number(viewsMatch?.[1] ?? 0),
    })
  }

  // Probe /shorts/{id} to filter out Shorts — 200 = Short, 303 = long-form
  const checks = await Promise.all(
    candidates.map(async (video) => {
      try {
        const res = await fetch(`https://www.youtube.com/shorts/${video.videoId}`, {
          method: 'HEAD',
          redirect: 'manual',
        })
        // 303 redirect means it's NOT a Short
        return res.status !== 200
      } catch {
        return true // keep on error
      }
    })
  )

  return candidates.filter((_, i) => checks[i])
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
