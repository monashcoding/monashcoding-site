'use client'

import { HomepageSection, EventDocument, SocialLink } from '@/lib/sanity/types'
import {
  StorySection,
  InstagramSection,
  SponsorsSection,
  Footer,
  SectionRenderer,
} from '@/components/home'

interface HomeContentProps {
  sections?: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
}

export function HomeContent({ sections, events, socialLinks }: HomeContentProps) {
  // If sections are provided from Sanity, render them in order
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} events={events} socialLinks={socialLinks} />
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
