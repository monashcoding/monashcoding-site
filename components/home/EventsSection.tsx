'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { EventsSectionData, EventDocument, EventTag } from '@/lib/sanity/types'
import { EVENT_TAGS } from '@/lib/events/eventTags'
import { EventCard } from '@/components/events/EventCard'

const FILTER_OPTIONS: { label: string; value: EventTag | 'all' }[] = [
  { label: 'All', value: 'all' },
  ...EVENT_TAGS.map((t) => ({ label: t.filterLabel, value: t.value })),
]

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
    },
  },
}

interface EventsSectionProps {
  data?: EventsSectionData
  events?: EventDocument[]
}

export function EventsSection({ data, events = [] }: EventsSectionProps) {
  const heading = data?.heading ?? 'Events & Announcements'
  const [activeTag, setActiveTag] = useState<EventTag | 'all'>('all')

  const filteredEvents =
    activeTag === 'all'
      ? events
      : events.filter((e) => e.tag === activeTag)

  const featuredEvent = useMemo(() => {
    if (filteredEvents.length === 0) return null
    return filteredEvents.find((event) => event.isPinned) ?? filteredEvents[0]
  }, [filteredEvents])

  const remainingEvents = useMemo(() => {
    if (!featuredEvent) return []
    return filteredEvents.filter((event) => event._id !== featuredEvent._id)
  }, [filteredEvents, featuredEvent])

  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      className="overflow-hidden"
      contentClassName="relative py-[clamp(5.5rem,10vw,8rem)] px-6 md:px-8"
    >
      <motion.div
        className="relative mx-auto max-w-[1240px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.16 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-white/70">
              Live updates
            </span>
            <h2 className="text-[clamp(2.2rem,4.9vw,4rem)] font-semibold leading-[0.98] text-foreground">
              {heading}
            </h2>
          </div>
          <p className="max-w-[28rem] text-sm leading-relaxed text-white/55 md:text-base">
            Discover workshops, socials, and flagship projects. Filter by category and jump straight into what matters most this semester.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-10 inline-flex flex-wrap items-center gap-2 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-2"
        >
          {FILTER_OPTIONS.map((filter) => {
            const active = activeTag === filter.value
            return (
              <motion.button
                key={filter.value}
                onClick={() => setActiveTag(filter.value)}
                className={`relative overflow-hidden rounded-xl px-4 py-2.5 text-xs font-semibold tracking-[0.11em] uppercase transition-colors duration-300 md:text-[0.78rem] ${
                  active ? 'text-[#252525]' : 'text-white/65 hover:text-white'
                }`}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                {active && (
                  <motion.span
                    layoutId="events-active-filter"
                    className="absolute inset-0 rounded-xl border border-accent/60 bg-accent shadow-[0_10px_25px_rgba(255,227,48,0.35)]"
                    transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </motion.button>
            )
          })}
        </motion.div>

        {featuredEvent ? (
          <div key={activeTag}>
            <motion.div
              variants={itemVariants}
              className="mb-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-accent/90">
                  Featured event
                </p>
                <span className="text-xs text-white/45">
                  {filteredEvents.length} {filteredEvents.length === 1 ? 'result' : 'results'}
                </span>
              </div>
              <EventCard event={featuredEvent} index={0} />
            </motion.div>

            {remainingEvents.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
              >
                {remainingEvents.map((event, index) => (
                  <EventCard key={event._id} event={event} index={index + 1} />
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          <motion.p
            key={`empty-${activeTag}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-[1.5rem] border border-dashed border-white/20 bg-white/[0.02] py-14 text-center text-white/45"
          >
            No upcoming events in this category.
          </motion.p>
        )}
      </motion.div>
    </RibbonAwareSection>
  )
}
