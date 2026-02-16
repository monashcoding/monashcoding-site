import { groq } from 'next-sanity'

export const aboutUsPageQuery = groq`
  *[_type == "aboutUsPage"][0] {
    pageTitle,
    pageSubtitle,
    mission,
    vision,
    values[] {
      _key,
      title,
      description
    },
    stats[] {
      _key,
      value,
      label
    }
  }
`
