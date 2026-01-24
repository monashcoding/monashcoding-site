'use client'

import { HomepageSection } from '@/lib/sanity/types'
import { StorySection } from './StorySection'
import { InstagramSection } from './InstagramSection'
import { SponsorsSection } from './SponsorsSection'
import { Footer } from './Footer'

interface SectionRendererProps {
  sections: HomepageSection[]
}

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'storySection':
            return <StorySection key={section._key} data={section} />
          case 'instagramSection':
            return <InstagramSection key={section._key} data={section} />
          case 'sponsorsSection':
            return <SponsorsSection key={section._key} data={section} />
          case 'footerSection':
            return <Footer key={section._key} data={section} />
          default:
            return null
        }
      })}
    </>
  )
}
