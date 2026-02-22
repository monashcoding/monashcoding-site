import type { EventTag } from '@/lib/sanity/types'

export interface EventTagConfig {
  value: EventTag
  label: string
  filterLabel: string
  style: string
}

export const EVENT_TAGS: EventTagConfig[] = [
  {
    value: 'event',
    label: 'Event',
    filterLabel: 'Events',
    style:
      'border border-white/22 bg-white text-[#252525]',
  },
  {
    value: 'hackathon',
    label: 'Hackathon',
    filterLabel: 'Hackathons',
    style:
      'border border-accent bg-accent text-[#252525]',
  },
  {
    value: 'social',
    label: 'Social',
    filterLabel: 'Social',
    style:
      'border border-[#7070e0] bg-[#5757D3] text-white',
  },
  {
    value: 'recruitment',
    label: 'Recruitment',
    filterLabel: 'Recruitment',
    style:
      'border border-[#FFE330] bg-[#FFE330] text-[#252525]',
  },
  {
    value: 'industry',
    label: 'Industry',
    filterLabel: 'Industry',
    style:
      'border border-[#4CAF50] bg-[#4CAF50] text-white',
  },
  {
    value: 'archives',
    label: 'Archives',
    filterLabel: 'Archives',
    style:
      'border border-white/30 bg-white/10 text-white',
  },
]

export const TAG_STYLES: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.style])
) as Record<EventTag, string>

export const TAG_LABELS: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.label])
) as Record<EventTag, string>
