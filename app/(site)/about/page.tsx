import { client } from '@/sanity/lib/client'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false

import { aboutUsPageQuery } from '@/sanity/lib/queries'
import { AboutUsPageData } from '@/lib/sanity/types'
import AboutUsPageClient from '@/components/AboutUsPageClient'

async function getAboutUsPageData(): Promise<AboutUsPageData | null> {
  try {
    return await client.fetch(aboutUsPageQuery, {}, { next: { tags: ['aboutUsPage'] } })
  } catch (error) {
    console.error('Error fetching about us page data:', error)
    return null
  }
}

export default async function AboutUsPage() {
  const data = await getAboutUsPageData()
  return <AboutUsPageClient data={data} />
}
