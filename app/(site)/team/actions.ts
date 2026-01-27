'use server'

import { client } from '@/sanity/lib/client'
import { CommitteeMember, TeamSlug } from '@/lib/sanity/types'
import { sortMembers } from '@/lib/committee-utils'
import {
  activeCommitteeMembersQuery,
  alumniCommitteeMembersQuery,
  committeeMembersByTeamFilteredQuery,
} from '@/sanity/lib/queries'

export type FilterOption = TeamSlug | 'all' | 'alumni'

export async function fetchCommitteeMembersByFilter(
  filter: FilterOption
): Promise<CommitteeMember[]> {
  const fetchOptions = { next: { tags: ['committeeMember'] } }

  let members: CommitteeMember[]

  if (filter === 'all') {
    members = await client.fetch(activeCommitteeMembersQuery, {}, fetchOptions)
  } else if (filter === 'alumni') {
    members = await client.fetch(alumniCommitteeMembersQuery, {}, fetchOptions)
  } else {
    members = await client.fetch(
      committeeMembersByTeamFilteredQuery,
      { team: filter },
      fetchOptions
    )
  }

  return sortMembers(members || [])
}
