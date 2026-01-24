import { client } from '@/sanity/lib/client'
import { heroQuery, homepageQuery } from '@/sanity/lib/queries'
import { HeroData, HomepageData } from '@/lib/sanity/types'
import { Hero } from '@/components/hero/Hero'
import { HomeContent } from '@/components/HomeContent'
import { GlobalRibbons } from '@/components/GlobalRibbons'

async function getHeroData(): Promise<HeroData | null> {
  try {
    return await client.fetch(heroQuery)
  } catch (error) {
    console.error('Failed to fetch hero data:', error)
    return null
  }
}

async function getHomepageData(): Promise<HomepageData | null> {
  try {
    return await client.fetch(homepageQuery)
  } catch (error) {
    console.error('Failed to fetch homepage data:', error)
    return null
  }
}

export default async function Home() {
  const [heroData, homepageData] = await Promise.all([
    getHeroData(),
    getHomepageData(),
  ])

  return (
    <main className="bg-background">
      <GlobalRibbons />
      <Hero data={heroData} />
      <HomeContent sections={homepageData?.sections} />
    </main>
  )
}
