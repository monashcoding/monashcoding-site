import { client } from '@/sanity/lib/client'
import { heroQuery } from '@/sanity/lib/queries'
import { HeroData } from '@/lib/sanity/types'
import { Hero } from '@/components/hero/Hero'
import { HomeContent } from '@/components/HomeContent'

async function getHeroData(): Promise<HeroData | null> {
  try {
    return await client.fetch(heroQuery)
  } catch (error) {
    console.error('Failed to fetch hero data:', error)
    return null
  }
}

export default async function Home() {
  const heroData = await getHeroData()

  return (
    <main className="bg-background">
      <Hero data={heroData} />
      <HomeContent />
    </main>
  )
}
