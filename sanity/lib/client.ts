import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID environment variable')
}
if (!dataset) {
  throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET or SANITY_STUDIO_DATASET environment variable')
}

const isDev = process.env.NODE_ENV === 'development'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || process.env.SANITY_STUDIO_API_VERSION || '2024-01-18',
  useCdn: !isDev,
})

/**
 * Returns Next.js fetch options for Sanity queries.
 * - In dev: no caching, so fresh data is always fetched.
 * - In prod: tag-based revalidation via webhook.
 */
export function sanityFetchOptions(tags: string[]): { next: { tags: string[] } } | { cache: 'no-store' } {
  if (isDev) return { cache: 'no-store' }
  return { next: { tags } }
}
