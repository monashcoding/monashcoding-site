import { groq } from 'next-sanity'

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    pageTitle,
    pageSubtitle,
    email,
    location,
    locationMapLink,
    bottomImage {
      ...,
      asset->
    }
  }
`
