import { groq } from 'next-sanity'

export const sponsorPageQuery = groq`
  *[_type == "sponsorPage"][0] {
    heroImage {
      asset->,
      alt,
      hotspot,
      crop
    },
    pageTitle,
    pageSubtitle,
    reasons[] {
      _key,
      title,
      description,
      image {
        asset->,
        alt,
        hotspot,
        crop
      }
    },
    stats[] {
      _key,
      value,
      label
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
    contactImage {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`
