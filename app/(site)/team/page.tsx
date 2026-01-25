import { Metadata } from 'next'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { client } from '@/sanity/lib/client'
import { teamPageQuery, teamMembersQuery } from '@/sanity/lib/queries'
import { TeamMember, TeamPageData } from '@/lib/sanity/types'
import TeamPageClient from '@/components/TeamPageClient'

export const metadata: Metadata = {
  title: 'Team | Monash Association of Coding',
  description: 'Meet the team behind Monash Association of Coding',
}

async function getTeamPageData(): Promise<TeamPageData | null> {
  try {
    return await client.fetch(teamPageQuery, {}, { next: { tags: ['teamPage'] } })
  } catch (error) {
    console.error('Failed to fetch team page data:', error)
    return null
  }
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    return (await client.fetch(teamMembersQuery, {}, { next: { tags: ['teamMember'] } })) || []
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    return []
  }
}

export default async function TeamPage() {
  const [pageData, members] = await Promise.all([
    getTeamPageData(),
    getTeamMembers(),
  ])

  return <TeamPageClient pageData={pageData} members={members} />
}
