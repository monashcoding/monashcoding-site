'use client'

import { HomepageSection, EventDocument, SocialLink } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import {
  InstagramSection,
  SponsorsSection,
  SectionRenderer,
} from '@/components/home'

interface HomeContentProps {
  sections?: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
}

export function HomeContent({ sections, events, socialLinks, youtubeVideos }: HomeContentProps) {
  // If sections are provided from Sanity, render them in order
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} events={events} socialLinks={socialLinks} youtubeVideos={youtubeVideos} />
  }

  // Fallback to default sections if no Sanity data
  return (
    <>
      <InstagramSection />
      <SponsorsSection />
    </>
  )
}
