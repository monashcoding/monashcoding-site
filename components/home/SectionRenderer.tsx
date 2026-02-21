'use client'

import { HomepageSection, EventDocument, SocialLink } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import { InstagramSection } from './InstagramSection'
import { SponsorsSection } from './SponsorsSection'
import { EventsSection } from './EventsSection'
import { CommunitySection } from './CommunitySection'
import { ContentStreamSection } from './ContentStreamSection'

interface SectionRendererProps {
  sections: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
}

export function SectionRenderer({ sections, events, socialLinks, youtubeVideos }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'instagramSection':
            return <InstagramSection key={section._key} data={section} />
          case 'sponsorsSection':
            return <SponsorsSection key={section._key} data={section} />
          case 'eventsSection':
            return <EventsSection key={section._key} data={section} events={events} />
          case 'communitySection':
            return <CommunitySection key={section._key} data={section} socialLinks={socialLinks} youtubeVideos={youtubeVideos} />
          case 'contentStreamSection':
            return <ContentStreamSection key={section._key} data={section} />
          case 'footerSection':
            return null // Footer is rendered globally in the site layout
          default:
            return null
        }
      })}
    </>
  )
}
