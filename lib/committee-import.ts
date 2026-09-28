// --- Team slug mapping ---

// Used for both direct team name lookup (normalizeTeam) and substring matching in role titles (inferTeamFromRole)
const TEAM_SLUG_MAP: Record<string, string> = {
  management: 'management',
  president: 'management',
  secretary: 'management',
  treasurer: 'management',
  events: 'events',
  event: 'events',
  competitions: 'events',
  competition: 'events',
  marketing: 'marketing',
  design: 'design',
  'human resources': 'human-resources',
  'people and culture': 'human-resources',
  'p&c': 'human-resources',
  sponsorship: 'sponsorship',
  sponsor: 'sponsorship',
  media: 'media',
  'short form media': 'media',
  'long form media': 'media',
  projects: 'projects',
  project: 'projects',
  outreach: 'outreach',
  infrastructure: 'projects',
}

export function normalizeTeam(team: string): string | undefined {
  const lower = team.trim().toLowerCase()
  return TEAM_SLUG_MAP[lower]
}

// --- Infer team from a role string (e.g. "Events Director" -> "events") ---

// Management keywords take priority over other matches
const MANAGEMENT_KEYWORDS = ['president', 'secretary', 'treasurer', 'vice president']

export function inferTeamFromRole(role: string): string | undefined {
  const lower = role.trim().toLowerCase()

  // Check management keywords first (they take priority)
  for (const keyword of MANAGEMENT_KEYWORDS) {
    if (lower.includes(keyword)) return 'management'
  }

  // Then check other team keywords
  for (const [keyword, slug] of Object.entries(TEAM_SLUG_MAP)) {
    if (lower.includes(keyword)) return slug
  }
  return undefined
}

// --- Bento.me URL normalization ---

export function normalizeBentoUrl(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'bento.me/' || trimmed === 'https://bento.me/') return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('bento.me/')) return `https://${trimmed}`
  return `https://bento.me/${trimmed}`
}

// --- LinkedIn URL normalization ---

export function normalizeLinkedIn(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed || trimmed === 'linkedin.com/in/' || trimmed === 'remove the "https://www."') return undefined
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('www.')) return `https://${trimmed}`
  if (trimmed.startsWith('linkedin.com')) return `https://www.${trimmed}`
  return `https://www.linkedin.com/in/${trimmed}`
}

// --- Birthday parsing (strip year) ---

export function parseBirthday(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  // Notion CSV format: "May 14, 2026" — we strip the year
  const match = trimmed.match(/^(\w+)\s+(\d{1,2}),?\s*\d{0,4}$/)
  if (match) {
    return `${match[1]} ${match[2]}`
  }

  // Try DD/MM/YYYY format from body
  const dmyMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/\d{2,4}$/)
  if (dmyMatch) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December']
    const monthIdx = parseInt(dmyMatch[2], 10) - 1
    if (monthIdx >= 0 && monthIdx < 12) {
      return `${months[monthIdx]} ${parseInt(dmyMatch[1], 10)}`
    }
  }

  return trimmed
}

// --- MBTI normalization ---

export function parseMbti(raw: string): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  // Extract just the 4-letter code, e.g. "INTP : Logician" -> "INTP"
  const match = trimmed.match(/^([A-Z]{4})/)
  if (match) return match[1]
  return trimmed
}

// --- Normalize a raw first-day string into "27 Mar 2024" or "Mar 2024" ---

const MONTH_NAMES: Record<string, string> = {
  january: 'Jan', february: 'Feb', march: 'Mar', april: 'Apr',
  may: 'May', june: 'Jun', july: 'Jul', august: 'Aug',
  september: 'Sep', october: 'Oct', november: 'Nov', december: 'Dec',
  jan: 'Jan', feb: 'Feb', mar: 'Mar', apr: 'Apr',
  jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep',
  oct: 'Oct', nov: 'Nov', dec: 'Dec',
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function normalizeFirstDay(raw: string): string | undefined {
  // Strip Markdown bold markers and ordinal suffixes ("9th August 2021" -> "9 August 2021")
  const s = raw
    .replace(/\*/g, '')
    .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1')
    .trim()
  if (!s) return undefined

  let day: number | undefined
  let month: string | undefined
  let year: number | undefined

  // Format: DD/MM/YYYY, D/M/YYYY or DD/MM/YY
  const slashMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/)
  if (slashMatch) {
    day = parseInt(slashMatch[1], 10)
    const monthNum = parseInt(slashMatch[2], 10)
    year = parseInt(slashMatch[3], 10)
    if (year < 100) year += 2000
    if (monthNum >= 1 && monthNum <= 12) {
      month = SHORT_MONTHS[monthNum - 1]
    }
  }

  // Format: "27 March 2020", "27 Mar 2020", "3 October 2024", "9 Feb, 2023"
  if (!month) {
    const dayFirstMatch = s.match(/^(\d{1,2})\s+([A-Za-z]+),?\s+(\d{4})$/)
    if (dayFirstMatch) {
      day = parseInt(dayFirstMatch[1], 10)
      month = MONTH_NAMES[dayFirstMatch[2].toLowerCase()]
      year = parseInt(dayFirstMatch[3], 10)
    }
  }

  // Format: "March 27, 2020" or "Mar 27 2020"
  if (!month) {
    const monthFirstMatch = s.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/)
    if (monthFirstMatch) {
      month = MONTH_NAMES[monthFirstMatch[1].toLowerCase()]
      day = parseInt(monthFirstMatch[2], 10)
      year = parseInt(monthFirstMatch[3], 10)
    }
  }

  // Format: "October 2020" or "Mar 2024" (month + year only, no day)
  if (!month) {
    const monthYearMatch = s.match(/^([A-Za-z]+)\s+(\d{4})$/)
    if (monthYearMatch) {
      month = MONTH_NAMES[monthYearMatch[1].toLowerCase()]
      year = parseInt(monthYearMatch[2], 10)
      day = undefined
    }
  }

  // Validate
  if (!month || !year || year < 1900 || year > 2100) return undefined
  if (day !== undefined && (day < 1 || day > 31)) return undefined

  return day ? `${day} ${month} ${year}` : `${month} ${year}`
}

// --- Resolve a team slug from Notion's team tags, current role, then past roles ---

// Tags like "Executive" and "First Year Reps" have no slug and are skipped
export function resolveTeam(teams: string[], role: string, pastRoles?: string[]): string | undefined {
  let teamSlug = teams.map(normalizeTeam).find(Boolean)

  // If no team resolved, try to infer from current role
  if (!teamSlug && role) {
    teamSlug = inferTeamFromRole(role)
  }

  // If still no team resolved, infer from past roles
  // Priority: management > director role > most recent match
  if (!teamSlug && pastRoles?.length) {
    let directorTeam: string | undefined
    let firstMatch: string | undefined

    for (const pastRole of pastRoles) {
      const inferred = inferTeamFromRole(pastRole)
      if (!inferred) continue

      if (inferred === 'management') {
        teamSlug = 'management'
        break
      }
      if (!directorTeam && /director/i.test(pastRole)) {
        directorTeam = inferred
      }
      if (!firstMatch) {
        firstMatch = inferred
      }
    }

    if (!teamSlug) {
      teamSlug = directorTeam || firstMatch
    }
  }

  return teamSlug
}
