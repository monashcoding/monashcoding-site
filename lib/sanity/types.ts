import { PortableTextBlock } from '@portabletext/types'
import type { SocialPlatform } from '@/lib/socialPlatforms'

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
  image?: SanityImage
}

export interface SocialLink {
  _key: string
  platform: SocialPlatform
  url: string
  description?: string
}

export interface PageVisibility {
  oWeek: boolean | null
}

export interface NavigationData {
  navItems: NavItem[]
  pageVisibility?: PageVisibility
}

export interface SocialLinksData {
  links: SocialLink[]
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

export interface CommitteeMember {
  _id: string
  name: string
  role: string
  team: TeamSlug
  photo?: SanityImage
  pastRoles?: string[]
  bio?: string
  linkedIn?: string
  email?: string
  discordHandle?: string
  bentoMe?: string
  birthday?: string
  gender?: string
  isAlumni?: boolean
  mbti?: string
  firstDay?: string
}

export interface TimelineEvent {
  _key: string
  date: string
  title: string
  description?: string
}

export interface TeamDescription {
  _key: string
  team: TeamSlug
  description: string
}

export interface CommitteePageData {
  pageTitle: string
  pageSubtitle?: string
  heroImage?: SanityImage
  teamDescriptions?: TeamDescription[]
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

export interface SponsorLogo {
  _key: string
  name: string
  logo: SanityImage
}

export interface Benefit {
  _key: string
  icon: string
  title: string
  description: string
}

export interface SponsorPageData {
  heroImage?: SanityImage
  pageTitle: string
  pageSubtitle: string
  reasons: {
    _key: string
    title: string
    description: string
    image?: SanityImage
  }[]
  stats: Stat[]
  benefitsTitle: string
  benefits: Benefit[]
  sponsorsTitle: string
  sponsors: SponsorLogo[]
  ctaTitle: string
  ctaDescription: string
  contactImage?: SanityImage
}

// Contact
export type ContactSocialLink = SocialLink

export interface ContactPageData {
  pageTitle: string
  pageSubtitle: string
  senderEmail: string
  recipientEmail: string
  location: string
  locationMapLink: string
  bottomImage: SanityImage
}

// Event types
export type EventTag = 'event' | 'hackathon' | 'social' | 'recruitment' | 'industry' | 'archives'

export interface EventLink {
  _key: string
  label: string
  linkType: 'url' | 'emailReminder'
  url?: string
}

export interface EventDocument {
  _id: string
  title: string
  slug: { current: string }
  description: string
  image?: SanityImage
  date: string
  endDate?: string
  location?: string
  links?: EventLink[]
  tag: EventTag
  isPinned: boolean
  hideDate?: boolean
  body?: PortableTextBlock[]
}

export interface EventsSectionData {
  _key: string
  _type: 'eventsSection'
  heading: string
  maxEvents: number
}

export interface InstagramReelUrl {
  _key: string
  url: string
  pinned?: boolean
}

export interface CommunitySectionData {
  _key: string
  _type: 'communitySection'
  heading: string
  subheading?: string
  platforms?: SocialPlatform[]
  instagramReels?: InstagramReelUrl[]
}

// Homepage Sections
export interface SponsorsSectionData {
  _key: string
  _type: 'sponsorsSection'
  heading: string
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

export type HomepageSection =
  | SponsorsSectionData
  | EventsSectionData
  | CommunitySectionData

export interface HomepageData {
  sections: HomepageSection[]
}

// About Us
export interface AboutUsValue {
  _key: string
  title: string
  description: string
  image?: SanityImage
}

export interface AboutUsStat {
  _key: string
  value: string
  label: string
}

export interface AboutUsJourneyYear {
  _key: string
  year: string
  summary: string | PortableTextBlock[]
}

export interface AboutUsPageData {
  pageTitle: string
  pageSubtitle: string | PortableTextBlock[]
  heroImage?: SanityImage
  missionTitle: string
  missionBody: string | PortableTextBlock[]
  missionImage?: SanityImage
  values: AboutUsValue[]
  journey: AboutUsJourneyYear[]
  journeyImage?: SanityImage
  whereAreWeNow: string | PortableTextBlock[]
  stats: AboutUsStat[]
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
