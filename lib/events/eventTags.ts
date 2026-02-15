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
      'border border-white/22 bg-white/10 text-white',
  },
  {
    value: 'hackathon',
    label: 'Hackathon',
    filterLabel: 'Hackathons',
    style:
      'border border-accent/55 bg-accent/25 text-accent',
  },
  {
    value: 'social',
    label: 'Social',
    filterLabel: 'Social',
    style:
      'border border-[#7070e0]/70 bg-[#5757D3]/28 text-[#e6e6ff]',
  },
  {
    value: 'recruitment',
    label: 'Recruitment',
    filterLabel: 'Recruitment',
    style:
      'border border-[#FFE330]/65 bg-[#FFE330]/82 text-[#252525]',
  },
]

export const TAG_STYLES: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.style])
) as Record<EventTag, string>

export const TAG_LABELS: Record<EventTag, string> = Object.fromEntries(
  EVENT_TAGS.map((t) => [t.value, t.label])
) as Record<EventTag, string>
