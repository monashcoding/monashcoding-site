import { groq } from 'next-sanity'

export const aboutUsPageQuery = groq`
  *[_type == "aboutUsPage"][0] {
    pageTitle,
    pageSubtitle,
    heroImage { asset->, hotspot, crop },
    missionTitle,
    missionBody,
    missionImage { asset->, hotspot, crop },
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
    journeyImage { asset->, hotspot, crop },
    whereAreWeNow,
    stats[] {
      _key,
      value,
      label
    }
  }
`
