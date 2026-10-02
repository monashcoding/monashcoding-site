'use client'

import { HomepageSection, EventDocument, SocialLink, SponsorPageData } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import { SponsorLogosGrid } from '@/components/sponsor/SponsorLogosGrid'
import { EventsSection } from './EventsSection'
import { CommunityExtras, CommunitySection } from './CommunitySection'

interface SectionRendererProps {
  sections: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
  sponsorPageData?: SponsorPageData | null
}

export function SectionRenderer({ sections, events, socialLinks, youtubeVideos, sponsorPageData }: SectionRendererProps) {
  const community = sections.find((section) => section._type === 'communitySection')
  const hasSponsors = sections.some((section) => section._type === 'sponsorsSection')

  return (
    <>
      {sections.map((section) => {
        switch (section._type) {
          case 'sponsorsSection':
            return (
              <SponsorLogosGrid
                key={section._key}
                title={sponsorPageData?.sponsorsTitle}
                sponsors={sponsorPageData?.sponsors}
                communityLabel={community?._type === 'communitySection' ? community.heading || 'Our Community' : undefined}
                community={
                  community?._type === 'communitySection' ? (
                    <CommunityExtras data={community} socialLinks={socialLinks} youtubeVideos={youtubeVideos} />
                  ) : undefined
                }
              />
            )
          case 'eventsSection':
            return <EventsSection key={section._key} data={section} events={events} />
          case 'communitySection':
            if (hasSponsors) return null
            return <CommunitySection key={section._key} data={section} socialLinks={socialLinks} youtubeVideos={youtubeVideos} />
          default:
            return null
        }
      })}
    </>
  )
}
