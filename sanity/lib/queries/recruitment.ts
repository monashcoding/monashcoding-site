import { groq } from 'next-sanity'

export const recruitmentPageQuery = groq`
  *[_type == "recruitmentPage"][0] {
    pageTitle,
    pageSubtitle,
    perks[] {
      _key,
      icon,
      title,
      description
    },
    timeline[] {
      _key,
      date,
      title,
      description
    },
    ctaTitle,
    ctaDescription,
    ctaButtonText,
    ctaButtonLink,
    applicationsOpen
  }
`

export const recruitmentPositionsQuery = groq`
  *[_type == "recruitmentPosition" && isOpen == true] | order(order asc) {
    _id,
    name,
    icon,
    description,
    requirements,
    isOpen
  }
`

export const allRecruitmentPositionsQuery = groq`
  *[_type == "recruitmentPosition"] | order(order asc) {
    _id,
    name,
    icon,
    description,
    requirements,
    isOpen
  }
`
