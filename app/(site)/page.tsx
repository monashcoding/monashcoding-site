import { client, sanityFetchOptions } from '@/sanity/lib/client'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { heroQuery, homepageQuery, upcomingEventsQuery, navigationQuery, sponsorPageQuery } from '@/sanity/lib/queries'
import { HeroData, HomepageData, EventDocument, NavigationData, SponsorPageData } from '@/lib/sanity/types'
import { getSocialLinksData } from '@/lib/sanity/fetchers'
import { Hero, type HeroEvent, type HeroMonth } from '@/components/hero/Hero'
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

const MELBOURNE_MONTH = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Melbourne', year: 'numeric', month: '2-digit' })
const MONTH_LABEL = new Intl.DateTimeFormat('en-AU', { timeZone: 'UTC', month: 'long', year: 'numeric' })
const MONTH_SHORT = new Intl.DateTimeFormat('en-AU', { timeZone: 'UTC', month: 'short' })

function monthKeyOf(date: Date): string {
  const parts = MELBOURNE_MONTH.formatToParts(date)
  const year = parts.find((part) => part.type === 'year')?.value
  const month = parts.find((part) => part.type === 'month')?.value
  return `${year}-${month}`
}

function buildEventTimeline(events: EventDocument[]): { events: HeroEvent[]; months: HeroMonth[] } {
  const now = Date.now()
  const withCover = events.filter((event) => event.image?.asset?.url)
  const keys = [monthKeyOf(new Date(now)), ...withCover.map((event) => monthKeyOf(new Date(event.date)))]
  const lastKey = keys.sort().at(-1)!
  const [lastYear, lastMonth] = lastKey.split('-').map(Number)
  const months: HeroMonth[] = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(Date.UTC(lastYear, lastMonth - 1 - i, 1))
    return {
      key: `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`,
      label: MONTH_LABEL.format(date),
      short: MONTH_SHORT.format(date),
    }
  })
  const inWindow = new Set(months.map((month) => month.key))
  const timelineEvents = withCover
    .map((event) => ({
      event,
      monthKey: monthKeyOf(new Date(event.date)),
      upcoming: Date.parse(event.endDate ?? event.date) >= now,
    }))
    .filter((entry) => inWindow.has(entry.monthKey))
    .sort((a, b) => Date.parse(b.event.date) - Date.parse(a.event.date))
  return { events: timelineEvents, months }
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
      <Hero data={heroData} timeline={buildEventTimeline(events)} />
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
