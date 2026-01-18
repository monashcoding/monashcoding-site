import { groq } from 'next-sanity'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    titleLines,
    description,
    heroImage {
      asset->,
      alt,
      hotspot,
      crop
    },
    scrollIndicatorText
  }
`
