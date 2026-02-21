import { NextRequest, NextResponse } from 'next/server'
import { fetchInstagramReels } from '@/lib/instagram/feed'

export async function POST(req: NextRequest) {
  try {
    const { urls } = (await req.json()) as { urls?: string[] }
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ reels: [] })
    }
    // Limit to 12 per request to avoid timeouts
    const limited = urls.slice(0, 12)
    const reels = await fetchInstagramReels(limited)
    return NextResponse.json({ reels })
  } catch {
    return NextResponse.json({ reels: [] })
  }
}
