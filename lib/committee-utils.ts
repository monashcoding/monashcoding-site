import { CommitteeMember, TeamSlug } from '@/lib/sanity/types'

export const TEAM_ORDER: TeamSlug[] = [
  'management',
  'events',
  'marketing',
  'design',
  'human-resources',
  'sponsorship',
  'media',
  'projects',
  'outreach',
]

// Role priority within management team (lower = higher priority)
const MANAGEMENT_ROLE_PRIORITY: Record<string, number> = {
  president: 0,
  'vice president': 1,
  secretary: 2,
  treasurer: 3,
}

function getManagementRolePriority(role: string): number {
  const normalized = role.toLowerCase().trim()
  for (const [key, priority] of Object.entries(MANAGEMENT_ROLE_PRIORITY)) {
    if (normalized.includes(key)) return priority
  }
  return 99
}

function isDirector(role: string): boolean {
  return role.toLowerCase().includes('director')
}

export function sortMembers(members: CommitteeMember[]): CommitteeMember[] {
  return [...members].sort((a, b) => {
    // Sort by team order first
    const teamOrderA = TEAM_ORDER.indexOf(a.team)
    const teamOrderB = TEAM_ORDER.indexOf(b.team)
    if (teamOrderA !== teamOrderB) return teamOrderA - teamOrderB

    // Within management, sort by role priority
    if (a.team === 'management') {
      const priorityA = getManagementRolePriority(a.role)
      const priorityB = getManagementRolePriority(b.role)
      if (priorityA !== priorityB) return priorityA - priorityB
    }

    // Directors first within each team
    const aIsDirector = isDirector(a.role)
    const bIsDirector = isDirector(b.role)
    if (aIsDirector && !bIsDirector) return -1
    if (!aIsDirector && bIsDirector) return 1

    // Then alphabetical by name
    return a.name.localeCompare(b.name)
  })
}
