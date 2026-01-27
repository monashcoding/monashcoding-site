import { groq } from 'next-sanity'

export const socialLinksQuery = groq`
  *[_type == "socialLinks"][0] {
    links[] {
      _key,
      platform,
      url
    }
  }
`
