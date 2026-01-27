import { Metadata } from 'next'

// Static generation - revalidated via webhook on Sanity publish
export const revalidate = false
import { client } from '@/sanity/lib/client'
import { committeePageQuery, committeeMembersQuery } from '@/sanity/lib/queries'
import { CommitteeMember, CommitteePageData } from '@/lib/sanity/types'
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

async function getCommitteeMembers(): Promise<CommitteeMember[]> {
  try {
    return (await client.fetch(committeeMembersQuery, {}, { next: { tags: ['committeeMember'] } })) || []
  } catch (error) {
    console.error('Failed to fetch committee members:', error)
    return []
  }
}

export default async function CommitteePage() {
  const [pageData, members] = await Promise.all([
    getCommitteePageData(),
    getCommitteeMembers(),
  ])

  return <CommitteePageClient pageData={pageData} members={members} />
}
