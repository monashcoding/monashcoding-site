import { groq } from 'next-sanity'

export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(isPinned desc, date asc) [0...$limit] {
    _id,
    title,
    slug,
    description,
    image {
      asset->,
      alt,
      hotspot,
      crop
    },
    date,
    endDate,
    location,
    signupLink,
    tag,
    isPinned
  }
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    image {
      asset->,
      alt,
      hotspot,
      crop
    },
    date,
    endDate,
    location,
    signupLink,
    tag,
    isPinned,
    body[] {
      ...,
      _type == "image" => {
        asset->,
        alt,
        caption
      }
    }
  }
`

export const eventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)].slug.current
`
