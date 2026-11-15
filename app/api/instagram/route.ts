import { handleRoute, parseBody } from '@monashcoding/server'
import { z } from 'zod'
import { fetchInstagramReels } from '@/lib/instagram/feed'
import { logger } from '@/lib/log'
import type { NoParams } from '@/lib/route'

const reelRequest = z.object({ urls: z.array(z.string()).default([]) })

export const POST = handleRoute<NoParams>(async (request) => {
  const { urls } = await parseBody(request, reelRequest)
  // Limit to 12 per request to avoid timeouts
  const reels = await fetchInstagramReels(urls.slice(0, 12))

  return Response.json({ reels })
}, { logger: logger.child('instagram') })
