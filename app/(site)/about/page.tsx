import { client, sanityFetchOptions } from '@/sanity/lib/client'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false

import { aboutUsPageQuery } from '@/sanity/lib/queries'
import type { AboutUsPageData } from '@/lib/sanity/types'
import AboutUsPageClient from '@/components/AboutUsPageClient'
import { logger } from '@/lib/log'

async function getAboutUsPageData(): Promise<AboutUsPageData | null> {
  try {
    return await client.fetch(aboutUsPageQuery, {}, sanityFetchOptions(['aboutUsPage']))
  } catch (error) {
    logger.error('Error fetching about us page data', error)

    return null
  }
}

export default async function AboutUsPage() {
  const data = await getAboutUsPageData()

  return <AboutUsPageClient data={data} />
}
