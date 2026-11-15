import { createIngestHandler } from '@monashcoding/analytics/ingest'

const handler = createIngestHandler()

export const dynamic = 'force-dynamic'
export const GET = handler
export const POST = handler
export const OPTIONS = handler
