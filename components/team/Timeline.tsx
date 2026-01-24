'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ChevronDown } from 'lucide-react'
import { TimelineEvent } from '@/lib/sanity/types'

interface TimelineProps {
  events: TimelineEvent[]
}

interface YearGroup {
  year: string
  events: TimelineEvent[]
}


function YearMenuItem({
  year,
  events,
  isExpanded,
  onToggle,
}: {
  year: string
  events: TimelineEvent[]
  isExpanded: boolean
  onToggle: () => void
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(6)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(6, needed))
    }
    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [year])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      if (contentWidth === 0) return
      if (animationRef.current) animationRef.current.kill()
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: 12,
        ease: 'none',
        repeat: -1,
      })
    }
    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) animationRef.current.kill()
    }
  }, [year, repetitions])

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div className="w-full">
      {/* Year Menu Item */}
      <div
        ref={itemRef}
        className="relative h-20 overflow-hidden border-t border-black/10 first:border-t-0"
      >
        <button
          className="flex h-full w-full cursor-pointer items-center justify-center text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-foreground uppercase"
          onClick={onToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="flex items-center gap-3">
            {year}
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="h-6 w-6" />
            </motion.span>
          </span>
        </button>
        {/* Marquee on hover */}
        <div
          ref={marqueeRef}
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ transform: 'translate3d(0, 101%, 0)', backgroundColor: '#f8e45c' }}
        >
          <div className="flex h-full w-full items-center overflow-hidden">
            <div
              ref={marqueeInnerRef}
              className="flex h-full w-fit items-center will-change-transform"
              aria-hidden="true"
            >
              {[...Array(repetitions)].map((_, idx) => (
                <div
                  key={idx}
                  className="marquee__part flex shrink-0 items-center px-8 text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-black uppercase"
                >
                  <span>{year}</span>
                  <span className="mx-4 text-black/60">•</span>
                  <span className="text-[clamp(1rem,3vw,1.5rem)] font-normal normal-case">
                    {events.length} milestone{events.length !== 1 ? 's' : ''}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Events Grid */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="overflow-hidden"
          >
            <EventsGrid events={events} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function EventsGrid({ events }: { events: TimelineEvent[] }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const chromaRef = useRef<HTMLDivElement>(null)
  const hasInteracted = useRef(false)
  const setX = useRef<((value: number) => void) | null>(null)
  const setY = useRef<((value: number) => void) | null>(null)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setX.current = gsap.quickSetter(el, '--x', 'px') as (value: number) => void
    setY.current = gsap.quickSetter(el, '--y', 'px') as (value: number) => void
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: 0.45,
      ease: 'power3.out',
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current?.getBoundingClientRect()
    if (!r) return
    moveTo(e.clientX - r.left, e.clientY - r.top)

    // Show chroma overlay on first interaction
    if (!hasInteracted.current) {
      hasInteracted.current = true
      gsap.to(chromaRef.current, { opacity: 1, duration: 0.4, overwrite: true })
    }
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    // Only show fade overlay if user has interacted
    if (hasInteracted.current) {
      gsap.to(fadeRef.current, { opacity: 1, duration: 0.6, overwrite: true })
    }
  }

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)
  }

  return (
    <div
      ref={rootRef}
      className="events-grid relative grid w-full gap-4 bg-secondary/50 p-6 md:p-8"
      style={
        {
          '--x': '50%',
          '--y': '50%',
          '--r': '250px',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        } as React.CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {events.map((event, i) => (
        <motion.article
          key={event._key}
          className="event-card relative flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          onMouseMove={handleCardMove}
          style={
            {
              '--card-border': '#f8e45c',
              '--mouse-x': '50%',
              '--mouse-y': '50%',
            } as React.CSSProperties
          }
        >
          {/* Spotlight effect */}
          <div
            className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(248, 228, 92, 0.2), transparent 60%)',
            }}
          />
          <div className="relative z-0 p-5">
            <span className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'rgba(248, 228, 92, 0.3)', color: '#b8860b' }}>
              {event.date}
            </span>
            <h3 className="mb-2 text-xl font-bold text-foreground">{event.title}</h3>
            {event.description && (
              <p className="text-sm leading-relaxed text-foreground/70">{event.description}</p>
            )}
          </div>
        </motion.article>
      ))}
      {/* Chroma overlay */}
      <div
        ref={chromaRef}
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          backdropFilter: 'grayscale(1) brightness(1.1)',
          WebkitBackdropFilter: 'grayscale(1) brightness(1.1)',
          background: 'rgba(255, 255, 255, 0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0.5) 75%, rgba(0, 0, 0, 0.68) 88%, white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), transparent 0%, transparent 15%, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.22) 45%, rgba(0, 0, 0, 0.35) 60%, rgba(0, 0, 0, 0.5) 75%, rgba(0, 0, 0, 0.68) 88%, white 100%)',
          opacity: 0,
        }}
      />
      {/* Fade overlay */}
      <div
        ref={fadeRef}
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          backdropFilter: 'grayscale(1) brightness(1.1)',
          WebkitBackdropFilter: 'grayscale(1) brightness(1.1)',
          background: 'rgba(255, 255, 255, 0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 0.78) 45%, rgba(255, 255, 255, 0.65) 60%, rgba(255, 255, 255, 0.5) 75%, rgba(255, 255, 255, 0.32) 88%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y), white 0%, white 15%, rgba(255, 255, 255, 0.9) 30%, rgba(255, 255, 255, 0.78) 45%, rgba(255, 255, 255, 0.65) 60%, rgba(255, 255, 255, 0.5) 75%, rgba(255, 255, 255, 0.32) 88%, transparent 100%)',
          opacity: 0,
        }}
      />
    </div>
  )
}

function HeaderItem({ text }: { text: string }) {
  const itemRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const marqueeInnerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | null>(null)
  const [repetitions, setRepetitions] = useState(6)

  const animationDefaults = { duration: 0.6, ease: 'expo' }

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom'
  }

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      const viewportWidth = window.innerWidth
      const needed = Math.ceil(viewportWidth / contentWidth) + 2
      setRepetitions(Math.max(6, needed))
    }
    calculateRepetitions()
    window.addEventListener('resize', calculateRepetitions)
    return () => window.removeEventListener('resize', calculateRepetitions)
  }, [text])

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return
      const marqueeContent = marqueeInnerRef.current.querySelector('.marquee__part')
      if (!marqueeContent) return
      const contentWidth = (marqueeContent as HTMLElement).offsetWidth
      if (contentWidth === 0) return
      if (animationRef.current) animationRef.current.kill()
      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: 10,
        ease: 'none',
        repeat: -1,
      })
    }
    const timer = setTimeout(setupMarquee, 50)
    return () => {
      clearTimeout(timer)
      if (animationRef.current) animationRef.current.kill()
    }
  }, [text, repetitions])

  const handleMouseEnter = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)
    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0)
  }

  const handleMouseLeave = (ev: React.MouseEvent) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return
    const rect = itemRef.current.getBoundingClientRect()
    const x = ev.clientX - rect.left
    const y = ev.clientY - rect.top
    const edge = findClosestEdge(x, y, rect.width, rect.height)
    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
  }

  return (
    <div
      ref={itemRef}
      className="relative h-[80px] overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex h-full w-full items-center justify-center text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-foreground uppercase">
        {text}
      </div>
      {/* Marquee on hover */}
      <div
        ref={marqueeRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ transform: 'translate3d(0, 101%, 0)', backgroundColor: '#f8e45c' }}
      >
        <div className="flex h-full w-full items-center overflow-hidden">
          <div
            ref={marqueeInnerRef}
            className="flex h-full w-fit items-center will-change-transform"
            aria-hidden="true"
          >
            {[...Array(repetitions)].map((_, idx) => (
              <div
                key={idx}
                className="marquee__part flex shrink-0 items-center px-8 text-[clamp(1.5rem,5vw,2.5rem)] font-semibold text-black uppercase"
              >
                <span>{text}</span>
                <span className="mx-6 text-black/40">✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Timeline({ events }: TimelineProps) {
  const [expandedYear, setExpandedYear] = useState<string | null>(null)

  if (!events || events.length === 0) {
    return null
  }

  const timelineEvents = events

  // Group events by year
  const yearGroups: YearGroup[] = timelineEvents.reduce((acc: YearGroup[], event) => {
    const yearMatch = event.date.match(/\d{4}/)
    const year = yearMatch ? yearMatch[0] : 'Unknown'
    const existingGroup = acc.find((g) => g.year === year)
    if (existingGroup) {
      existingGroup.events.push(event)
    } else {
      acc.push({ year, events: [event] })
    }
    return acc
  }, [])

  // Sort by year
  yearGroups.sort((a, b) => parseInt(a.year) - parseInt(b.year))

  const handleToggle = (year: string) => {
    setExpandedYear(expandedYear === year ? null : year)
  }

  return (
    <div className="w-full overflow-hidden bg-white/80 backdrop-blur-sm border-y border-black/10">
      <HeaderItem text="Our Journey" />
      {yearGroups.map((group) => (
        <YearMenuItem
          key={group.year}
          year={group.year}
          events={group.events}
          isExpanded={expandedYear === group.year}
          onToggle={() => handleToggle(group.year)}
        />
      ))}
    </div>
  )
}
