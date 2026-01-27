import { groq } from 'next-sanity'

export const committeePageQuery = groq`
  *[_type == "committeePage"][0] {
    pageTitle,
    pageSubtitle,
    timeline[] {
      _key,
      date,
      title,
      description
    }
  }
`

export const committeeMembersQuery = groq`
  *[_type == "committeeMember"] | order(team asc, order asc) {
    _id,
    name,
    role,
    team,
    bio,
    linkedIn,
    email,
    order,
    photo {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

export const committeeMembersByTeamQuery = groq`
  *[_type == "committeeMember" && team == $team] | order(order asc) {
    _id,
    name,
    role,
    team,
    bio,
    linkedIn,
    email,
    order,
    photo {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`
