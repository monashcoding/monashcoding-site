import { groq } from 'next-sanity'

export const heroQuery = groq`
  *[_type == "hero"][0] {
    titleLines,
    description,
    heroMedia[] {
      _key,
      _type,
      // Image fields
      image {
        asset->,
        hotspot,
        crop
      },
      // Video fields
      video {
        asset->
      },
      poster {
        asset->,
        hotspot,
        crop
      },
      alt
    },
    overlayOpacity,
    slideshowInterval,
    fadeDuration,
    scrollIndicatorText
  }
`
