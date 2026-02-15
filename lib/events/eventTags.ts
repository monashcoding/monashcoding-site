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
      'border border-white/22 bg-white/10 text-white shadow-[0_10px_22px_rgba(0,0,0,0.2)]',
  },
  {
    value: 'hackathon',
    label: 'Hackathon',
    filterLabel: 'Hackathons',
    style:
      'border border-accent/55 bg-accent/25 text-accent shadow-[0_10px_26px_rgba(255,227,48,0.28)]',
  },
  {
    value: 'social',
    label: 'Social',
    filterLabel: 'Social',
    style:
      'border border-[#7070e0]/70 bg-[#5757D3]/28 text-[#e6e6ff] shadow-[0_10px_24px_rgba(87,87,211,0.28)]',
  },
  {
    value: 'recruitment',
    label: 'Recruitment',
    filterLabel: 'Recruitment',
    style:
      'border border-[#FFE330]/65 bg-[#FFE330]/82 text-[#252525] shadow-[0_10px_22px_rgba(255,227,48,0.3)]',
  },
]

export const TAG_STYLES: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.style])
) as Record<EventTag, string>

export const TAG_LABELS: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.label])
) as Record<EventTag, string>
