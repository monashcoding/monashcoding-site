import { Metadata } from 'next'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { client } from '@/sanity/lib/client'
import { committeePageQuery, activeCommitteeMembersQuery, committeeTeamSummaryQuery } from '@/sanity/lib/queries'
import { CommitteeMember, CommitteePageData, TeamSlug } from '@/lib/sanity/types'
import { sortMembers } from '@/lib/committee-utils'
import CommitteePageClient from '@/components/CommitteePageClient'

export const metadata: Metadata = {
  title: 'Team | Monash Association of Coding',
  description: 'Meet the committee behind Monash Association of Coding',
}

async function getCommitteePageData(): Promise<CommitteePageData | null> {
  try {
    return await client.fetch(committeePageQuery, {}, { next: { tags: ['committeePage'] } })
  } catch (error) {
    console.error('Failed to fetch committee page data:', error)
    return null
  }
}

async function getInitialMembers(): Promise<CommitteeMember[]> {
  try {
    const members = await client.fetch(activeCommitteeMembersQuery, {}, { next: { tags: ['committeeMember'] } })
    return sortMembers(members || [])
  } catch (error) {
    console.error('Failed to fetch initial committee members:', error)
    return []
  }
}

async function getTeamSummary(): Promise<{ teams: TeamSlug[]; hasAlumni: boolean }> {
  try {
    return await client.fetch(committeeTeamSummaryQuery, {}, { next: { tags: ['committeeMember'] } })
  } catch (error) {
    console.error('Failed to fetch team summary:', error)
    return { teams: [], hasAlumni: false }
  }
}

export default async function CommitteePage() {
  const [pageData, initialMembers, teamSummary] = await Promise.all([
    getCommitteePageData(),
    getInitialMembers(),
    getTeamSummary(),
  ])

  return (
    <CommitteePageClient
      pageData={pageData}
      initialMembers={initialMembers}
      availableTeams={teamSummary.teams}
      hasAlumni={teamSummary.hasAlumni}
    />
  )
}
