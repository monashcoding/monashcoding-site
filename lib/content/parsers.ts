export function getInstagramShortcode(url: string): string | null {
  const match = url.match(
    /instagram\.com\/(?:reel|p)\/([A-Za-z0-9_-]+)/
  )
  return match?.[1] ?? null
}

export function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/
  )
  return match?.[1] ?? null
}
