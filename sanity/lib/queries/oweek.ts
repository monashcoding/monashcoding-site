import { groq } from 'next-sanity'

export const oweekPageQuery = groq`
  *[_type == "oweekPage"][0] {
    shown,
    pageTitle,
    pageSubtitle
  }
`
