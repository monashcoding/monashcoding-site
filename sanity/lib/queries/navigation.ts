import { groq } from 'next-sanity'

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
    navItems[] {
      _key,
      label,
      href
    },
    "pageVisibility": {
      "oWeek": *[_type == "oweekPage"][0].shown,
      "firstYearRecruitment": *[_type == "firstYearRecruitmentPage"][0].shown
    }
  }
`
