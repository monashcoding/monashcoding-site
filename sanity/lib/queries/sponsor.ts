import { groq } from 'next-sanity'

export const sponsorPageQuery = groq`
  *[_type == "sponsorPage"][0] {
    pageTitle,
    pageSubtitle,
    stats[] {
      _key,
      value,
      label
    },
    tiersTitle,
    tiersSubtitle,
    tiers[] {
      _key,
      name,
      price,
      featured,
      features
    },
    benefitsTitle,
    benefits[] {
      _key,
      icon,
      title,
      description
    },
    sponsorsTitle,
    sponsors[] {
      _key,
      name,
      logo {
        asset->,
        alt,
        hotspot,
        crop
      }
    },
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonLink
  }
`
