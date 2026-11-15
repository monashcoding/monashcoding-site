import { handleRoute, httpError, parseBody } from '@monashcoding/server'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { env } from '@/lib/env'
import { logger } from '@/lib/log'
import type { NoParams } from '@/lib/route'

const document = z.object({ _type: z.string().min(1, 'Missing document type') })

export const POST = handleRoute<NoParams>(async (request) => {
  const secret = request.headers.get('x-sanity-webhook-secret')

  // An unset secret matches nothing, so the route is closed until it is configured
  if (!env.SANITY_WEBHOOK_SECRET || secret !== env.SANITY_WEBHOOK_SECRET) {
    throw httpError.unauthenticated('Invalid secret')
  }

  const { _type } = await parseBody(request, document)

  // Revalidate the tag matching the Sanity document type
  revalidateTag(_type, { expire: 0 })

  return Response.json({
    revalidated: true,
    tag: _type,
  })
}, { logger: logger.child('revalidate') })
