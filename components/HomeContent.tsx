'use client'

import { HomepageSection, EventDocument, SocialLink, SponsorPageData } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import { SponsorLogosGrid } from '@/components/sponsor/SponsorLogosGrid'
import { SectionRenderer } from '@/components/home'

interface HomeContentProps {
  sections?: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
  sponsorPageData?: SponsorPageData | null
}

export function HomeContent({ sections, events, socialLinks, youtubeVideos, sponsorPageData }: HomeContentProps) {
  // If sections are provided from Sanity, render them in order
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} events={events} socialLinks={socialLinks} youtubeVideos={youtubeVideos} sponsorPageData={sponsorPageData} />
  }

  // Fallback to default sections if no Sanity data
  return (
    <>
      <SponsorLogosGrid title={sponsorPageData?.sponsorsTitle} sponsors={sponsorPageData?.sponsors} />
    </>
  )
}
