import { groq } from 'next-sanity'

export const teamPageQuery = groq`
  *[_type == "teamPage"][0] {
    title,
    subtitle
  }
`

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(team asc, order asc) {
    _id,
    name,
    role,
    team,
    bio,
    image {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

export const teamMembersByTeamQuery = groq`
  *[_type == "teamMember" && team == $team] | order(order asc) {
    _id,
    name,
    role,
    team,
    bio,
    image {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`
