import { PortableTextBlock } from '@portabletext/types'

// Common types
export interface SanityImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
      }
    }
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

// Hero Media Types
export interface HeroImageMedia {
  _key: string
  _type: 'heroImage'
  image: SanityImage
  alt: string
}

export interface SanityFile {
  asset: {
    _id: string
    url: string
  }
}

export interface HeroVideoMedia {
  _key: string
  _type: 'heroVideo'
  video: SanityFile
  poster?: SanityImage
  alt: string
}

export type HeroMedia = HeroImageMedia | HeroVideoMedia

// Announcement
export interface Announcement {
  _key: string
  message: PortableTextBlock[]
}

// Hero
export interface HeroData {
  titleLines: string[]
  description: PortableTextBlock[]
  heroMedia: HeroMedia[]
  overlayOpacity: number
  slideshowInterval: number
  fadeDuration: number
  scrollIndicatorText?: string
  showAnnouncements?: boolean
  announcementCycleDuration?: number
  announcements?: Announcement[]
}

// Navigation
export interface NavItem {
  _key: string
  label: string
  href: string
}

export interface SocialLink {
  _key: string
  label: string
  href: string
}

export interface PageVisibility {
  oWeek: boolean | null
  firstYearRecruitment: boolean | null
}

export interface NavigationData {
  navItems: NavItem[]
  socialLinks: SocialLink[]
  circularText: string
  pageVisibility?: PageVisibility
}

// Team types
export type TeamSlug =
  | 'management'
  | 'events'
  | 'marketing'
  | 'design'
  | 'human-resources'
  | 'sponsorship'
  | 'media'
  | 'projects'
  | 'outreach'

export interface TeamMemberImage {
  asset: {
    _id: string
    url: string
    metadata?: {
      dimensions: {
        width: number
        height: number
      }
    }
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  team: TeamSlug
  photo?: TeamMemberImage
  bio?: string
  linkedIn?: string
  email?: string
  order: number
}

export interface TimelineEvent {
  _key: string
  date: string
  title: string
  description?: string
}

export interface TeamPageData {
  pageTitle: string
  pageSubtitle?: string
  timeline?: TimelineEvent[]
}

// Recruitment
export interface RecruitmentPosition {
  _id: string
  name: string
  icon: string
  description: string
  requirements: string[]
  isOpen: boolean
}

export interface Perk {
  _key: string
  icon: string
  title: string
  description: string
}

export interface TimelineItem {
  _key: string
  date: string
  title: string
  description: string
}

export interface RecruitmentPageData {
  pageTitle: string
  pageSubtitle: string
  perks: Perk[]
  timeline: TimelineItem[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonLink: string
  applicationsOpen: boolean
}

// Sponsor
export interface Stat {
  _key: string
  value: string
  label: string
}

export interface SponsorTier {
  _key: string
  name: string
  price: string
  featured: boolean
  features: string[]
}

export interface Benefit {
  _key: string
  icon: string
  title: string
  description: string
}

export interface SponsorPageData {
  pageTitle: string
  pageSubtitle: string
  stats: Stat[]
  tiersTitle: string
  tiersSubtitle: string
  tiers: SponsorTier[]
  benefitsTitle: string
  benefits: Benefit[]
  ctaTitle: string
  ctaDescription: string
  ctaButtonText: string
  ctaButtonLink: string
}

// Contact
export interface ContactSocialLink {
  _key: string
  platform: 'instagram' | 'linkedin' | 'github' | 'twitter' | 'facebook' | 'youtube' | 'tiktok'
  url: string
}

export interface ContactPageData {
  pageTitle: string
  pageSubtitle: string
  email: string
  discordLink: string
  discordLabel: string
  location: string
  locationMapLink: string
  socialLinks: ContactSocialLink[]
}

// Homepage Sections
export interface StoryItem {
  _key: string
  year: string
  title: string
  content: string
}

export interface StorySectionData {
  _key: string
  _type: 'storySection'
  heading: string
  items: StoryItem[]
}

export interface InstagramSectionData {
  _key: string
  _type: 'instagramSection'
  heading: string
  handle: string
  url: string
  postCount: number
}

export interface Sponsor {
  _key: string
  name: string
  x: number
  y: number
}

export interface SponsorsSectionData {
  _key: string
  _type: 'sponsorsSection'
  heading: string
  description: string
  sponsors: Sponsor[]
}

export interface FooterLink {
  _key: string
  label: string
  url: string
  isExternal: boolean
}

export interface FooterColumn {
  _key: string
  title: string
  links: FooterLink[]
}

export interface FooterSectionData {
  _key: string
  _type: 'footerSection'
  brandName: string
  tagline: string
  columns: FooterColumn[]
  instagramUrl?: string
  linkedinUrl?: string
}

export type HomepageSection =
  | StorySectionData
  | InstagramSectionData
  | SponsorsSectionData
  | FooterSectionData

export interface HomepageData {
  sections: HomepageSection[]
}

// O Week Page
export interface OWeekPageData {
  shown: boolean
  pageTitle: string
  pageSubtitle: string
}

// First Year Recruitment Page
export interface FirstYearRecruitmentPageData {
  shown: boolean
  pageTitle: string
  pageSubtitle: string
}
