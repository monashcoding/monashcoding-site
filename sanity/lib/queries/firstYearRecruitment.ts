import { groq } from 'next-sanity'

export const firstYearRecruitmentPageQuery = groq`
  *[_type == "firstYearRecruitmentPage"][0] {
    shown,
    pageTitle,
    pageSubtitle
  }
`
