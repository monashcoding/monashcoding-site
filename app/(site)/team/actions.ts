'use server'

import { client } from '@/sanity/lib/client'
import { CommitteeMember } from '@/lib/sanity/types'
import { sortMembers } from '@/lib/committee-utils'
import {
  activeCommitteeMembersQuery,
  alumniCommitteeMembersPaginatedQuery,
  alumniCommitteeMembersCountQuery,
  committeeMembersByTeamFilteredQuery,
} from '@/sanity/lib/queries'
import { FilterOption, ALUMNI_PAGE_SIZE, PaginatedMembersResult } from './constants'

export async function fetchCommitteeMembersByFilter(
  filter: FilterOption
): Promise<CommitteeMember[]> {
  const fetchOptions = { next: { tags: ['committeeMember'] } }

  let members: CommitteeMember[]

  if (filter === 'all') {
    members = await client.fetch(activeCommitteeMembersQuery, {}, fetchOptions)
  } else if (filter === 'alumni') {
    // For alumni, fetch first page only (use fetchAlumniPaginated for more)
    members = await client.fetch(
      alumniCommitteeMembersPaginatedQuery,
      { start: 0, end: ALUMNI_PAGE_SIZE },
      fetchOptions
    )
  } else {
    members = await client.fetch(
      committeeMembersByTeamFilteredQuery,
      { team: filter },
      fetchOptions
    )
  }

  return sortMembers(members || [])
}

export async function fetchAlumniPaginated(
  page: number
): Promise<PaginatedMembersResult> {
  const fetchOptions = { next: { tags: ['committeeMember'] } }
  const start = page * ALUMNI_PAGE_SIZE
  const end = start + ALUMNI_PAGE_SIZE

  const [members, total] = await Promise.all([
    client.fetch(
      alumniCommitteeMembersPaginatedQuery,
      { start, end },
      fetchOptions
    ),
    client.fetch(alumniCommitteeMembersCountQuery, {}, fetchOptions),
  ])

  return {
    members: sortMembers(members || []),
    total,
    hasMore: end < total,
  }
}
