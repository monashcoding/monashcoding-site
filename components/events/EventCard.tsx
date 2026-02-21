'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { EventDocument } from '@/lib/sanity/types'
import { TAG_STYLES, TAG_LABELS } from '@/lib/events/eventTags'
import { urlFor } from '@/sanity/lib/image'

function formatEventDate(dateStr: string, endDateStr?: string): string {
  const date = new Date(dateStr)
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  }
  const timeOpts: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Australia/Melbourne',
  }
  const formattedDate = date.toLocaleDateString('en-AU', dateOpts)
  const formattedTime = date.toLocaleTimeString('en-AU', timeOpts)

  if (endDateStr) {
    const endDate = new Date(endDateStr)
    const endFormattedDate = endDate.toLocaleDateString('en-AU', dateOpts)
    const endFormattedTime = endDate.toLocaleTimeString('en-AU', timeOpts)
    return `${formattedDate}, ${formattedTime} - ${endFormattedDate}, ${endFormattedTime}`
  }
  return `${formattedDate}, ${formattedTime}`
}

interface EventCardProps {
  event: EventDocument
  index: number
}

export function EventCard({ event, index }: EventCardProps) {
  const isFeatured = event.isPinned || index === 0
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    setIsPast(new Date(event.date) < new Date())
  }, [event.date])

  return (
    <Link href={`/events/${event.slug.current}`} className={`group block h-full no-underline ${isPast ? 'opacity-50 grayscale-40' : ''}`}>
      <motion.article
        className="relative isolate h-full overflow-hidden rounded-[1.6rem] bg-[#f0f0f0] transition-colors duration-300"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.24 }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5, scale: 1.005 }}
      >

        <div className="relative mx-3 mt-3 overflow-hidden rounded-xl aspect-2/1">
          {event.image?.asset ? (
            <Image
              src={urlFor(event.image)
                .width(isFeatured ? 1400 : 800)
                .height(isFeatured ? 700 : 400)
                .url()}
              alt={event.image.alt || event.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="absolute inset-0 bg-[#444040]" />
          )}

          <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
            <span className={`inline-flex items-center justify-center rounded-full px-3 pt-[0.3rem] pb-[0.22rem] text-[0.68rem] leading-none font-semibold tracking-[0.12em] uppercase ${TAG_STYLES[event.tag]}`}>
              {TAG_LABELS[event.tag]}
            </span>
            {isFeatured && (
              <span className="inline-flex items-center justify-center rounded-full border border-accent bg-accent px-3 pt-[0.3rem] pb-[0.22rem] text-[0.63rem] leading-none font-semibold tracking-[0.14em] uppercase text-[#252525]">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className={`relative space-y-4 ${isFeatured ? 'p-7 md:p-8' : 'p-5 md:p-6'}`}>
          <div className="space-y-3">
            <h3 className={`font-semibold leading-[1.14] text-[#1a1a1a] ${isFeatured ? 'text-[clamp(1.5rem,2.1vw,2.2rem)]' : 'text-[clamp(1.15rem,1.4vw,1.45rem)]'}`}>
              {event.title}
            </h3>
            <p className={`text-black/55 leading-relaxed ${isFeatured ? 'line-clamp-3 text-[clamp(0.92rem,1.1vw,1.04rem)]' : 'line-clamp-2 text-[0.92rem]'}`}>
              {event.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 text-[0.74rem] text-black/60">
            {!event.hideDate && (
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5">
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {formatEventDate(event.date, event.endDate)}
              </span>
            )}
            {event.location && (
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1.5">
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
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {event.location}
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-2 text-[0.77rem] font-semibold tracking-[0.12em] uppercase text-[#1a1a1a] transition-transform duration-300 group-hover:translate-x-1">
            View event
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H8M17 7V16" />
            </svg>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
