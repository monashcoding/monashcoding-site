import { CommitteeMember, TeamSlug } from '@/lib/sanity/types'

export type FilterOption = TeamSlug | 'all' | 'alumni'

export const ALUMNI_PAGE_SIZE = 20

export interface PaginatedMembersResult {
  members: CommitteeMember[]
  total: number
  hasMore: boolean
}
