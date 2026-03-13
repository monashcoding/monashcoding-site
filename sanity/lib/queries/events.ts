import { groq } from 'next-sanity'

export const upcomingEventsQuery = groq`
  *[_type == "event"] | order(
    select(
      coalesce(endDate, date) >= now() => 0,
      1
    ) asc,
    isPinned desc,
    date asc
  ) {
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
