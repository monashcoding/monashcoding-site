'use client'

import { HomepageSection } from '@/lib/sanity/types'
import {
  StorySection,
  InstagramSection,
  SponsorsSection,
  Footer,
  SectionRenderer,
} from '@/components/home'

interface HomeContentProps {
  sections?: HomepageSection[]
}

export function HomeContent({ sections }: HomeContentProps) {
  // If sections are provided from Sanity, render them in order
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} />
  }

  // Fallback to default sections if no Sanity data
  return (
    <>
      <StorySection />
      <InstagramSection />
      <SponsorsSection />
      <Footer />
    </>
  )
}
