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

// --- Filtered queries for lazy loading ---

const memberProjection = `{
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
}`

export const activeCommitteeMembersQuery = groq`
  *[_type == "committeeMember" && isAlumni != true && !(role match "alumni")] | order(team asc, name asc) ${memberProjection}
`

export const alumniCommitteeMembersQuery = groq`
  *[_type == "committeeMember" && (isAlumni == true || role match "alumni")] | order(name asc) ${memberProjection}
`

// Paginated alumni query for better performance with large lists
export const alumniCommitteeMembersPaginatedQuery = groq`
  *[_type == "committeeMember" && (isAlumni == true || role match "alumni")] | order(name asc) [$start...$end] ${memberProjection}
`

export const alumniCommitteeMembersCountQuery = groq`
  count(*[_type == "committeeMember" && (isAlumni == true || role match "alumni")])
`

export const committeeMembersByTeamFilteredQuery = groq`
  *[_type == "committeeMember" && team == $team && isAlumni != true && !(role match "alumni")] | order(name asc) ${memberProjection}
`

export const committeeTeamSummaryQuery = groq`{
  "teams": array::unique(*[_type == "committeeMember" && isAlumni != true && !(role match "alumni")].team),
  "hasAlumni": count(*[_type == "committeeMember" && (isAlumni == true || role match "alumni")]) > 0
}`
