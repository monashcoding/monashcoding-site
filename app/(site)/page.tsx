import { client } from '@/sanity/lib/client'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { heroQuery, homepageQuery, upcomingEventsQuery, navigationQuery } from '@/sanity/lib/queries'
import { HeroData, HomepageData, EventDocument, NavigationData } from '@/lib/sanity/types'
import { getSocialLinksData } from '@/lib/sanity/fetchers'
import { Hero } from '@/components/hero/Hero'
import { HomeContent } from '@/components/HomeContent'
import { QuickLinksSection } from '@/components/home/QuickLinksSection'
import { fetchYouTubeVideos } from '@/lib/youtube/feed'
import { fetchInstagramReels } from '@/lib/instagram/feed'

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

export default async function Home() {
  const [heroData, homepageData, events, socialLinksData, navigationData, youtubeVideos] = await Promise.all([
    getHeroData(),
    getHomepageData(),
    getUpcomingEvents(),
    getSocialLinksData(),
    getNavigationData(),
    fetchYouTubeVideos(),
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

  // Fetch Instagram reel metadata from URLs configured in the communitySection
  const communitySection = homepageData?.sections?.find(
    (s) => s._type === 'communitySection'
  )
  const reelEntries =
    communitySection && 'instagramReels' in communitySection
      ? (communitySection.instagramReels ?? [])
      : []
  const instagramUrls = reelEntries.map((item) => item.url)
  const fetchedReels =
    instagramUrls.length > 0 ? await fetchInstagramReels(instagramUrls) : []
  // Merge the pinned flag from Sanity into the fetched reel data
  const instagramReels = fetchedReels.map((reel) => {
    const entry = reelEntries.find((e) => e.url === reel.url)
    return { ...reel, pinned: entry?.pinned ?? false }
  })

  return (
    <main className="bg-background">
      <Hero data={heroData} />
      <QuickLinksSection data={navigationData} />
      <HomeContent
        sections={homepageData?.sections}
        events={limitedEvents}
        socialLinks={socialLinksData?.links || []}
        youtubeVideos={youtubeVideos}
        instagramReels={instagramReels}
      />
    </main>
  )
}
