import { client, sanityFetchOptions } from '@/sanity/lib/client'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { heroQuery, homepageQuery, upcomingEventsQuery, navigationQuery, sponsorPageQuery } from '@/sanity/lib/queries'
import { HeroData, HomepageData, EventDocument, NavigationData, SponsorPageData } from '@/lib/sanity/types'
import { getSocialLinksData } from '@/lib/sanity/fetchers'
import { Hero } from '@/components/hero/Hero'
import { HomeContent } from '@/components/HomeContent'
import { QuickLinksSection } from '@/components/home/QuickLinksSection'
import { fetchYouTubeVideos } from '@/lib/youtube/feed'

async function getHeroData(): Promise<HeroData | null> {
  try {
    return await client.fetch(heroQuery, {}, sanityFetchOptions(['hero']))
  } catch (error) {
    console.error('Failed to fetch hero data:', error)
    return null
  }
}

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    return await client.fetch(homepageQuery, {}, sanityFetchOptions(['homepage']))
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return null
  }
}

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery, {}, sanityFetchOptions(['navigation']))
  } catch (error) {
    console.error('Failed to fetch navigation data:', error)
    return null
  }
}

async function getUpcomingEvents(): Promise<EventDocument[]> {
  try {
    return await client.fetch(upcomingEventsQuery, {}, sanityFetchOptions(['event']))
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

async function getSponsorPageData(): Promise<SponsorPageData | null> {
  try {
    return await client.fetch(sponsorPageQuery, {}, sanityFetchOptions(['sponsorPage']))
  } catch (error) {
    console.error('Failed to fetch sponsor page data:', error)
    return null
  }
}

export default async function Home() {
  const [heroData, homepageData, events, socialLinksData, navigationData, youtubeVideos, sponsorPageData] = await Promise.all([
    getHeroData(),
    getHomepageData(),
    getUpcomingEvents(),
    getSocialLinksData(),
    getNavigationData(),
    fetchYouTubeVideos(),
    getSponsorPageData(),
  ])

  return (
    <main className="bg-background">
      <Hero data={heroData} />
      <QuickLinksSection data={navigationData} />
      <HomeContent
        sections={homepageData?.sections}
        events={events}
        socialLinks={socialLinksData?.links || []}
        youtubeVideos={youtubeVideos}
        sponsorPageData={sponsorPageData}
      />
    </main>
  )
}
