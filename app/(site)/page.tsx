import { client } from '@/sanity/lib/client'

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
    return await client.fetch(heroQuery, {}, { next: { tags: ['hero'] } })
  } catch (error) {
    console.error('Failed to fetch hero data:', error)
    return null
  }
}

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    return await client.fetch(homepageQuery, {}, { next: { tags: ['homepage'] } })
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return null
  }
}

async function getNavigationData(): Promise<NavigationData | null> {
  try {
    return await client.fetch(navigationQuery, {}, { next: { tags: ['navigation'] } })
  } catch (error) {
    console.error('Failed to fetch navigation data:', error)
    return null
  }
}

async function getUpcomingEvents(limit: number = 20): Promise<EventDocument[]> {
  try {
    return await client.fetch(upcomingEventsQuery, { limit }, { next: { tags: ['event'] } })
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return []
  }
}

async function getSponsorPageData(): Promise<SponsorPageData | null> {
  try {
    return await client.fetch(sponsorPageQuery, {}, { next: { tags: ['sponsorPage'] } })
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

  // Determine maxEvents from the eventsSection config if present
  const eventsSection = homepageData?.sections?.find(
    (s) => s._type === 'eventsSection'
  )
  const maxEvents =
    eventsSection && 'maxEvents' in eventsSection
      ? eventsSection.maxEvents
      : 6
  const limitedEvents = events.slice(0, maxEvents)

  return (
    <main className="bg-background">
      <Hero data={heroData} />
      <QuickLinksSection data={navigationData} />
      <HomeContent
        sections={homepageData?.sections}
        events={limitedEvents}
        socialLinks={socialLinksData?.links || []}
        youtubeVideos={youtubeVideos}
        sponsorPageData={sponsorPageData}
      />
    </main>
  )
}
