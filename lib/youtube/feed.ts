const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID ?? 'UCxEz0QrpHJyLiWsVFgfUrRw'

export interface YouTubeVideo {
  videoId: string
  title: string
  published: string
  year: number
  thumbnail: string
  views: number
}

/**
 * Fetch long-form (non-Shorts) videos from the MAC YouTube channel RSS feed.
 * The RSS feed returns the latest ~15 videos; Shorts are filtered out
 * by checking for `/shorts/` in the link URL.
 *
 * If a playlist ID is provided (via env), it fetches from that playlist instead,
 * which is useful for curated long-form content.
 */
export async function fetchYouTubeVideos(): Promise<YouTubeVideo[]> {
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID

  const feedUrl = playlistId
    ? `https://www.youtube.com/feeds/videos.xml?playlist_id=${playlistId}`
    : `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`

  const res = await fetch(feedUrl, {
    next: { revalidate: 3600 }, // revalidate every hour
  })

  if (!res.ok) return []

  const xml = await res.text()
  return parseYouTubeFeed(xml)
}

function parseYouTubeFeed(xml: string): YouTubeVideo[] {
  const entries = xml.split('<entry>').slice(1) // skip preamble before first entry
  const videos: YouTubeVideo[] = []

  for (const entry of entries) {
    // Filter out Shorts — they use /shorts/ URLs
    const linkMatch = entry.match(
      /<link rel="alternate" href="([^"]+)"/
    )
    const link = linkMatch?.[1] ?? ''
    if (link.includes('/shorts/')) continue

    const videoIdMatch = entry.match(/<yt:videoId>([^<]+)</)
    const titleMatch = entry.match(/<title>([^<]+)</)
    const publishedMatch = entry.match(/<published>([^<]+)</)
    const viewsMatch = entry.match(/views="(\d+)"/)
    const thumbMatch = entry.match(
      /<media:thumbnail url="([^"]+)"/
    )

    const videoId = videoIdMatch?.[1]
    if (!videoId) continue

    const published = publishedMatch?.[1] ?? ''
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear()

    videos.push({
      videoId,
      title: decodeXmlEntities(titleMatch?.[1] ?? 'Untitled'),
      published,
      year,
      thumbnail: thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      views: Number(viewsMatch?.[1] ?? 0),
    })
  }

  return videos
}

function decodeXmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}
