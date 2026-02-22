import { groq } from 'next-sanity'

export const contactPageQuery = groq`
  *[_type == "contactPage"][0] {
    pageTitle,
    pageSubtitle,
    senderEmail,
    recipientEmail,
    location,
    locationMapLink,
    bottomImage {
      ...,
      asset->
    }
  }
`
