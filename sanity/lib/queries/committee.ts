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
  *[_type == "committeeMember"] | order(team asc, name asc) {
    _id,
    name,
    role,
    team,
    bio,
    linkedIn,
    email,
    discordHandle,
    bentoMe,
    birthday,
    mbti,
    isAlumni,
    pastRoles,
    firstDay,
    photo {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`

export const committeeMembersByTeamQuery = groq`
  *[_type == "committeeMember" && team == $team] | order(name asc) {
    _id,
    name,
    role,
    team,
    bio,
    linkedIn,
    email,
    photo {
      asset->,
      alt,
      hotspot,
      crop
    }
  }
`
