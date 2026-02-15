'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { EventDocument } from '@/lib/sanity/types'
import { TAG_STYLES, TAG_LABELS } from '@/lib/events/eventTags'
import { EventBody } from '@/lib/sanity/eventPortableText'
import { urlFor } from '@/sanity/lib/image'

function formatEventDate(dateStr: string, endDateStr?: string): string {
  const date = new Date(dateStr)
  const opts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  }
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Australia/Melbourne',
  }
  const formatted = date.toLocaleDateString('en-AU', opts)
  const time = date.toLocaleTimeString('en-AU', timeOpts)

  if (endDateStr) {
    const endDate = new Date(endDateStr)
    const endFormatted = endDate.toLocaleDateString('en-AU', opts)
    if (formatted === endFormatted) {
      const endTime = endDate.toLocaleTimeString('en-AU', timeOpts)
      return `${formatted}, ${time} - ${endTime}`
    }
    return `${formatted} - ${endFormatted}`
  }
  return `${formatted} at ${time}`
}

interface EventPageClientProps {
  event: EventDocument
}

export function EventPageClient({ event }: EventPageClientProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.18])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])

  return (
    <main className="min-h-screen bg-background">
      <RibbonAwareSection backgroundClassName="bg-background" contentClassName="relative overflow-hidden">
        <div ref={heroRef} className="relative min-h-[66vh] overflow-hidden md:min-h-[76vh]">
          <motion.div className="absolute inset-0" style={{ scale: imageScale, y: imageY }}>
            {event.image?.asset ? (
              <Image
                src={urlFor(event.image).width(1800).height(1200).url()}
                alt={event.image.alt || event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#5757D3_0%,#252525_50%,rgba(255,227,48,0.38)_100%)]" />
            )}
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.5)_45%,#252525_100%)]" />

          <motion.div className="relative mx-auto flex min-h-[66vh] max-w-[1200px] items-end px-6 pb-10 md:min-h-[76vh] md:px-8 md:pb-14" style={{ y: contentY }}>
            <div className="w-full max-w-[820px]">
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/35 px-3.5 py-2 text-xs font-semibold tracking-[0.1em] uppercase text-white/75 no-underline backdrop-blur-[8px] transition-colors duration-300 hover:border-white/35 hover:text-white"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>

              <motion.div
                className="mb-5 flex flex-wrap items-center gap-2.5"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className={`inline-flex rounded-full px-3 py-1 text-[0.67rem] font-semibold tracking-[0.13em] uppercase ${TAG_STYLES[event.tag]}`}>
                  {TAG_LABELS[event.tag]}
                </span>
                {event.isPinned && (
                  <span className="inline-flex rounded-full border border-accent/55 bg-accent/25 px-3 py-1 text-[0.67rem] font-semibold tracking-[0.13em] uppercase text-accent">
                    Featured
                  </span>
                )}
              </motion.div>

              <motion.h1
                className="text-[clamp(2.1rem,6.3vw,5rem)] font-semibold leading-[0.95] text-foreground"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                {event.title}
              </motion.h1>

              <motion.p
                className="mt-5 max-w-[52rem] text-[clamp(1rem,1.7vw,1.3rem)] leading-relaxed text-white/74"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.56, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                {event.description}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </RibbonAwareSection>

      <RibbonAwareSection
        backgroundClassName="bg-background"
        contentClassName="relative px-6 pb-[clamp(4.5rem,8vw,6.5rem)] pt-4 md:px-8"
      >
        <div className="relative mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <motion.aside
            className="h-fit overflow-hidden rounded-[1.45rem] border border-white/12 bg-[#1e1e1e]/95 p-5 shadow-[0_22px_45px_rgba(0,0,0,0.35)] md:p-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 text-[0.68rem] font-semibold tracking-[0.15em] uppercase text-accent">
              Event details
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/14 bg-black/28 p-4">
                <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-white/50">
                  Date
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground">
                  {formatEventDate(event.date, event.endDate)}
                </p>
              </div>

              {event.location && (
                <div className="rounded-xl border border-white/14 bg-black/28 p-4">
                  <p className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-white/50">
                    Location
                  </p>
                  <p className="mt-1.5 text-sm text-foreground">{event.location}</p>
                </div>
              )}

              {event.signupLink && (
                <a
                  href={event.signupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent/70 bg-accent px-5 py-3 text-sm font-semibold tracking-[0.08em] uppercase text-accent-foreground no-underline shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Sign Up / RSVP
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              )}
            </div>
          </motion.aside>

          <motion.article
            className="overflow-hidden rounded-[1.45rem] border border-white/12 bg-[#1a1a1a]/95 p-6 shadow-[0_24px_52px_rgba(0,0,0,0.34)] md:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.16 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-[clamp(1.45rem,2.8vw,2.2rem)] font-semibold text-foreground">
              Overview
            </h2>
            <p className="mt-4 text-[clamp(0.98rem,1.25vw,1.12rem)] leading-relaxed text-white/72">
              {event.description}
            </p>

            {event.body && event.body.length > 0 && (
              <div className="mt-8 border-t border-white/10 pt-8">
                <EventBody value={event.body} className="text-white/80" />
              </div>
            )}
          </motion.article>
        </div>
      </RibbonAwareSection>
    </main>
  )
}
