import { createHealthHandler } from '@monashcoding/server'

export const dynamic = 'force-dynamic'

// Pages are prerendered and served without Sanity or Resend, so there is no
// dependency the site cannot run without.
export const GET = createHealthHandler({ service: 'monashcoding-site' })
