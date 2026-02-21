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
    links[] { _key, label, linkType, url },
    tag,
    isPinned,
    hideDate
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
    links[] { _key, label, linkType, url },
    tag,
    isPinned,
    hideDate,
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
