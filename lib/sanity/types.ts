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

export interface HeroImage extends SanityImage {
  alt: string
}

// Hero
export interface HeroData {
  titleLines: string[]
  subtitle: string
  description: PortableTextBlock[]
  heroImage: HeroImage
  scrollIndicatorText?: string
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

export interface NavigationData {
  navItems: NavItem[]
  socialLinks: SocialLink[]
  circularText: string
}

// Team
export interface TeamMember {
  _id: string
  name: string
  role: string
  team: 'Executive' | 'Education' | 'Events' | 'Marketing' | 'Technology'
  bio?: string
  image?: SanityImage
}

export interface TeamPageData {
  title: string
  subtitle: string
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
