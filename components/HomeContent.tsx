'use client'

import { HomepageSection, EventDocument, SocialLink } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import type { InstagramReel } from '@/lib/instagram/feed'
import {
  StorySection,
  InstagramSection,
  SponsorsSection,
  SectionRenderer,
} from '@/components/home'

interface HomeContentProps {
  sections?: HomepageSection[]
  events?: EventDocument[]
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
  instagramReels?: InstagramReel[]
}

export function HomeContent({ sections, events, socialLinks, youtubeVideos, instagramReels }: HomeContentProps) {
  // If sections are provided from Sanity, render them in order
  if (sections && sections.length > 0) {
    return <SectionRenderer sections={sections} events={events} socialLinks={socialLinks} youtubeVideos={youtubeVideos} instagramReels={instagramReels} />
  }

  // Fallback to default sections if no Sanity data
  return (
    <>
      <StorySection />
      <InstagramSection />
      <SponsorsSection />
    </>
  )
}
