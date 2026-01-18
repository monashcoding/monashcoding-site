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
      {/* Temporary test section - remove later */}
      <section className="min-h-screen bg-black flex items-center justify-center">
        <h2 className="text-white text-6xl font-bold">Test Section 1</h2>
      </section>
      <section className="min-h-screen bg-neutral-800 flex items-center justify-center">
        <h2 className="text-white text-6xl font-bold">Test Section 2</h2>
      </section>
      <HomeContent />
    </main>
  )
}
