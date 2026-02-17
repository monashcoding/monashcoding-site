import { groq } from 'next-sanity'

export const aboutUsPageQuery = groq`
  *[_type == "aboutUsPage"][0] {
    pageTitle,
    pageSubtitle,
    missionTitle,
    missionBody,
    values[] {
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
    journey[] {
      _key,
      year,
      summary
    },
    whereAreWeNow,
    stats[] {
      _key,
      value,
      label
    }
  }
`
