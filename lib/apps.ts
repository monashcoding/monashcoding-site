export type AppAudience = 'public' | 'committee'

export type AppGlyph =
  | 'monmap'
  | 'jobs'
  | 'study'
  | 'verify'
  | 'quiz'
  | 'studio'
  | 'crm'
  | 'mail'

export interface MacApp {
  id: string
  name: string
  host: string
  url: string
  glyph: AppGlyph
  summary: string
  audience: AppAudience
  badge?: 'New'
  hero?: {
    subdomain: string
    description: string
    cta: string
  }
}

export type HeroApp = MacApp & { hero: NonNullable<MacApp['hero']> }

export const MAC_APPS: MacApp[] = [
  {
    id: 'monmap',
    name: 'MonMap',
    host: 'monmap.monashcoding.com',
    url: 'https://monmap.monashcoding.com/',
    glyph: 'monmap',
    summary: 'Plan your degree',
    audience: 'public',
    badge: 'New',
    hero: {
      subdomain: 'monmap',
      description:
        'Lay out your course semester by semester, check every requirement as you go and keep an eye on your WAM. Built to replace MonPlan.',
      cta: 'Open MonMap',
    },
  },
  {
    id: 'jobs',
    name: 'Jobs',
    host: 'jobs.monashcoding.com',
    url: 'https://jobs.monashcoding.com/',
    glyph: 'jobs',
    summary: 'Internships and grad roles',
    audience: 'public',
    hero: {
      subdomain: 'jobs',
      description:
        'Internship and graduate listings gathered from across the web every day, deduplicated, filterable and tracked in one place.',
      cta: 'Browse jobs',
    },
  },
  {
    id: 'study',
    name: 'MAC Study',
    host: 'study.monashcoding.com',
    url: 'https://study.monashcoding.com/',
    glyph: 'study',
    summary: 'Study timer with friends',
    audience: 'public',
    badge: 'New',
    hero: {
      subdomain: 'study',
      description:
        "Start a timer, study alongside your friends and climb your group's leaderboard. Installs on your phone like an app.",
      cta: 'Start studying',
    },
  },
  {
    id: 'verify',
    name: 'Member Pricing',
    host: 'verify.monashcoding.com',
    url: 'https://verify.monashcoding.com/',
    glyph: 'verify',
    summary: 'Cheaper event tickets',
    audience: 'public',
    hero: {
      subdomain: 'verify',
      description:
        'Link your MAC membership once and your member discount is applied when you buy tickets to MAC events.',
      cta: 'Link membership',
    },
  },
  {
    id: 'quiz',
    name: 'Team Quiz',
    host: 'what-is-your-mac-team.monashcoding.com',
    url: 'https://what-is-your-mac-team.monashcoding.com/',
    glyph: 'quiz',
    summary: 'Which MAC team are you?',
    audience: 'public',
  },
  {
    id: 'studio',
    name: 'Site Studio',
    host: 'monashcoding.com/studio',
    url: '/studio',
    glyph: 'studio',
    summary: 'Edit this website',
    audience: 'committee',
  },
  {
    id: 'crm',
    name: 'Sponsorship CRM',
    host: 'crm.monashcoding.com',
    url: 'https://crm.monashcoding.com/',
    glyph: 'crm',
    summary: 'Sponsor pipeline',
    audience: 'committee',
  },
  {
    id: 'mail',
    name: 'Mailing Lists',
    host: 'mail.monashcoding.com',
    url: 'https://mail.monashcoding.com/admin/',
    glyph: 'mail',
    summary: 'Newsletters and campaigns',
    audience: 'committee',
  },
]

export const PUBLIC_APPS = MAC_APPS.filter((app) => app.audience === 'public')

export const COMMITTEE_APPS = MAC_APPS.filter((app) => app.audience === 'committee')

export const HERO_APPS = MAC_APPS.filter((app): app is HeroApp => Boolean(app.hero))
