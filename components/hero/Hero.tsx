'use client'

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { EventDocument, HeroData, HeroMedia, SanityImage } from '@/lib/sanity/types'
import { HeroDescription } from '@/lib/sanity/portableText'
import { MEMBER_SIGNUP_URL } from '@/lib/links'
import { HERO_APPS } from '@/lib/apps'
import { urlFor } from '@/sanity/lib/image'
import { RibbonText, RibbonBlock } from '@/components/RibbonText'
import { openAppLauncher } from '@/components/launcher/AppLauncher'
import { AppIcon } from '@/components/launcher/AppIcon'
import { AnnouncementBanner } from './AnnouncementBanner'
import { AppStage, type StageItem } from './AppStage'

const DWELL_SECONDS = 7
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]
const EASE_OVERLAY: [number, number, number, number] = [0.76, 0, 0.24, 1]

const FALLBACK_TITLE = ['Monash', 'Association', 'of Coding']

const FALLBACK_MEDIA: HeroMedia[] = [
  {
    _key: 'fallback-1',
    _type: 'heroImage',
    image: { asset: { _id: '', url: '/hero-image-optimized.jpg' } },
    alt: 'MAC community',
  },
]

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

function imageUrl(image: SanityImage | undefined): string {
  if (!image?.asset?.url) return '/hero-image-optimized.jpg'
  if (image.asset.url.startsWith('/')) return image.asset.url
  return urlFor(image).width(1920).height(1080).fit('crop').url()
}

function TextReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const timing = { duration: 1.3, delay, ease: 'easeInOut' as const, times: [0, 0.25, 0.6, 1] }
  return (
    <span className="relative inline-block overflow-x-clip">
      <span className="invisible">{children}</span>
      <motion.span
        className="absolute inset-0"
        initial={{ clipPath: 'inset(-10% 100% -10% 0)' }}
        animate={{
          clipPath: [
            'inset(-10% 100% -10% 0)',
            'inset(-10% 100% -10% 0)',
            'inset(-10% 100% -10% 0)',
            'inset(-10% 0% -10% 0)',
          ],
        }}
        transition={timing}
      >
        <RibbonText>{children}</RibbonText>
      </motion.span>
      <motion.span
        className="absolute -inset-y-2 left-0 right-0 bg-[#FFE330]"
        initial={{ x: '-105%' }}
        animate={{ x: ['-105%', '0%', '0%', '200%'] }}
        transition={timing}
      />
    </span>
  )
}

function FallbackDescription() {
  return (
    <p>
      At MAC, we aim to impart{' '}
      <span className="bg-accent px-1 py-0.5">technical skills and industry-relevant experiences</span> to
      students to <span className="bg-accent px-1 py-0.5">bridge the gap between the classroom</span> and
      industry. We want to make coding a fun experience for all, regardless of degree, year level and
      experience, by providing <span className="bg-accent px-1 py-0.5">collaborative learning opportunities</span>{' '}
      for our members.
    </p>
  )
}

function HeroBackdrop({ data, scrollProgress }: { data: HeroData | null; scrollProgress: MotionValue<number> }) {
  const media = data?.heroMedia?.length ? data.heroMedia : FALLBACK_MEDIA
  const [index, setIndex] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const opacity = useTransform(scrollProgress, [0, 0.8], [1, 0])
  const current = media[index]
  const currentIsVideo = current?._type === 'heroVideo'
  const interval = (data?.slideshowInterval || 5) * 1000

  useEffect(() => {
    if (media.length <= 1 || (currentIsVideo && videoPlaying)) return
    const timer = setInterval(() => setIndex((value) => (value + 1) % media.length), interval)
    return () => clearInterval(timer)
  }, [media.length, interval, currentIsVideo, videoPlaying])

  useEffect(() => {
    if (current?._type !== 'heroVideo') {
      setVideoPlaying(false)
      return
    }
    const video = videoRefs.current.get(current._key)
    if (!video) return
    video.currentTime = 0
    video
      .play()
      .then(() => setVideoPlaying(true))
      .catch(() => {})
  }, [current])

  const onVideoEnd = () => {
    setVideoPlaying(false)
    if (media.length > 1) setIndex((value) => (value + 1) % media.length)
  }

  return (
    <motion.div aria-hidden className="absolute inset-0 -z-10" style={{ opacity }}>
      {media.map((item, itemIndex) => (
        <motion.div
          key={item._key || itemIndex}
          className="absolute inset-0"
          style={{ filter: 'grayscale(80%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: itemIndex === index ? 1 : 0 }}
          transition={{ duration: data?.fadeDuration || 1, ease: 'easeInOut' }}
        >
          {item._type === 'heroImage' ? (
            <Image
              src={imageUrl(item.image)}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={itemIndex === 0}
            />
          ) : item._type === 'heroVideo' ? (
            <video
              ref={(node) => {
                if (node) videoRefs.current.set(item._key, node)
              }}
              src={item.video?.asset?.url}
              poster={item.poster ? imageUrl(item.poster) : undefined}
              className="h-full w-full object-cover"
              muted
              playsInline
              onEnded={onVideoEnd}
            />
          ) : null}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-black/80 lg:bg-black/65" />
      <div className="absolute inset-0 hidden bg-linear-to-l from-[#161616] via-[#161616]/80 to-transparent lg:block" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-[#252525]" />
    </motion.div>
  )
}

function TitleLockup({ lines }: { lines: string[] }) {
  const label = lines.join(' ')
  if (lines.length !== 3) {
    return (
      <h1 className="text-[clamp(2.5rem,10vw,3.5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white lg:text-[clamp(2.75rem,4.6vw,5.25rem)]">
        {lines.map((line, index) => (
          <span key={index} className="block">
            <TextReveal delay={index * 0.15}>{line}</TextReveal>
          </span>
        ))}
      </h1>
    )
  }
  const [first, second, third] = lines
  const joiner = /^(of|for|the|and)\s+(.+)$/i.exec(third)
  return (
    <h1
      aria-label={label}
      className="w-fit text-[clamp(2.6rem,10.5vw,3.75rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-white lg:text-[clamp(2.75rem,4.6vw,5.4rem)]"
    >
      <span aria-hidden className="block">
        <TextReveal delay={0}>{first}</TextReveal>
      </span>
      <span aria-hidden className="block pl-[0.6em]">
        <TextReveal delay={0.15}>{second}</TextReveal>
      </span>
      <span aria-hidden className="flex items-start justify-end gap-[0.14em]">
        {joiner && (
          <motion.span
            className="mt-[0.32em] text-[0.33em] font-extrabold uppercase leading-none tracking-[0.02em] text-white"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.5, ease: EASE_OUT }}
          >
            {joiner[1]}
          </motion.span>
        )}
        <TextReveal delay={0.3}>{joiner ? joiner[2] : third}</TextReveal>
      </span>
    </h1>
  )
}

function RollingSubdomain({ word, reduced }: { word: string; reduced: boolean }) {
  const sizerRef = useRef<HTMLSpanElement>(null)
  const [width, setWidth] = useState<number | null>(null)

  useIsomorphicLayoutEffect(() => {
    const node = sizerRef.current
    if (!node) return
    const update = () => setWidth(node.getBoundingClientRect().width)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [word])

  return (
    <motion.span
      className="relative inline-grid overflow-hidden bg-accent align-top text-accent-foreground"
      initial={false}
      animate={width === null ? undefined : { width }}
      transition={{ duration: reduced ? 0 : 0.7, ease: EASE_OVERLAY }}
    >
      <span
        ref={sizerRef}
        className="invisible col-start-1 row-start-1 w-max whitespace-nowrap px-[0.14em] pb-[0.06em]"
      >
        {word}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={word}
          className="col-start-1 row-start-1 whitespace-nowrap px-[0.14em] pb-[0.06em]"
          initial={reduced ? { opacity: 0 } : { y: '105%' }}
          animate={reduced ? { opacity: 1 } : { y: '0%' }}
          exit={reduced ? { opacity: 0 } : { y: '-105%' }}
          transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE_OVERLAY }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export interface HeroEvent {
  event: EventDocument
  upcoming: boolean
  monthKey: string
}

export interface HeroMonth {
  key: string
  label: string
  short: string
}

interface RailEntry {
  key: string
  title: string
  detail: string
  lines: string[]
  short?: string
  enabled: boolean
  target: number
}

function ShowcaseRail({
  entries,
  activeKey,
  onPick,
}: {
  entries: RailEntry[]
  activeKey: string | undefined
  onPick: (index: number) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  return (
    <div className="relative flex w-14 shrink-0 flex-col pt-[56px]">
      <ol className="relative flex flex-1 flex-col items-center justify-between py-3">
        <span aria-hidden className="absolute bottom-3 left-1/2 top-3 w-px -translate-x-1/2 bg-white/12" />
        {entries.map((entry) => {
          const isActive = entry.key === activeKey
          const isHovered = hovered === entry.key
          return (
            <li key={entry.key} className="relative z-10 flex items-center">
              <button
                type="button"
                aria-disabled={!entry.enabled}
                onClick={() => {
                  if (entry.enabled) onPick(entry.target)
                }}
                onMouseEnter={() => setHovered(entry.key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(entry.key)}
                onBlur={() => setHovered(null)}
                aria-label={`${entry.title}, ${entry.detail}`}
                aria-current={isActive ? 'true' : undefined}
                className={`group/dot relative grid size-6 place-items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  entry.enabled ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive
                      ? 'size-3.5 bg-accent ring-4 ring-accent/25'
                      : entry.enabled
                        ? 'size-2.5 bg-white/70 group-hover/dot:size-3 group-hover/dot:bg-white'
                        : 'size-1.5 bg-white/25'
                  }`}
                />
              </button>
              {entry.short && (
                <span
                  aria-hidden
                  className={`absolute left-full ml-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                    isActive ? 'text-accent' : entry.enabled ? 'text-white/55' : 'text-white/25'
                  }`}
                >
                  {entry.short}
                </span>
              )}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    role="tooltip"
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    className="pointer-events-none absolute right-full top-1/2 mr-2 w-60 -translate-y-1/2 rounded-xl border border-white/10 bg-[#141414] p-3.5 text-left"
                  >
                    <p className="text-sm font-bold text-white">{entry.title}</p>
                    <p className="mt-0.5 text-xs text-white/60">{entry.detail}</p>
                    {entry.lines.length > 0 && (
                      <ul className="mt-2.5 flex flex-col gap-1.5 border-t border-white/10 pt-2.5">
                        {entry.lines.map((line) => (
                          <li key={line} className="flex items-start gap-2 text-xs leading-snug text-white/85">
                            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

type ShowcaseMode = 'events' | 'projects'

const SHOWCASE_LABELS: Record<ShowcaseMode, string> = {
  events: 'MAC Events',
  projects: 'MAC Projects',
}

const EVENT_DATE = new Intl.DateTimeFormat('en-AU', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Australia/Melbourne',
})

function eventItem({ event, upcoming }: HeroEvent): StageItem {
  return {
    id: `event-${event._id}`,
    name: event.title,
    href: `/events/${event.slug.current}`,
    external: false,
    image: urlFor(event.image!).width(1600).fit('max').url(),
    imageClass: 'object-cover object-center',
    unoptimized: true,
    icon: (
      <span className="grid size-[22px] place-items-center rounded-md bg-accent text-accent-foreground">
        <CalendarDays size={13} strokeWidth={2.4} />
      </span>
    ),
    label: (front) => (
      <span className="flex min-w-0 items-center gap-2 text-xs">
        <span className={`truncate font-semibold ${front ? 'text-white' : 'text-white/75'}`}>{event.title}</span>
        {!event.hideDate && <span className="shrink-0 text-white/50">{EVENT_DATE.format(new Date(event.date))}</span>}
        {upcoming && front && (
          <span className="shrink-0 rounded-sm bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-accent-foreground">
            Upcoming
          </span>
        )}
      </span>
    ),
  }
}

function projectItem(app: (typeof HERO_APPS)[number]): StageItem {
  const [sub, ...rest] = app.host.split('.')
  return {
    id: `app-${app.id}`,
    name: app.name,
    href: app.url,
    external: true,
    image: `/apps/${app.id}.webp`,
    imageClass: 'object-cover object-top',
    icon: <AppIcon name={app.glyph} size={22} />,
    label: (front) => (
      <span className={`truncate text-xs font-medium ${front ? 'text-white/55' : 'text-white/45'}`}>
        <span className={front ? 'text-white' : 'text-white/75'}>{sub}</span>.{rest.join('.')}
      </span>
    ),
  }
}

interface HeroProps {
  data: HeroData | null
  timeline?: { events: HeroEvent[]; months: HeroMonth[] }
}

function defaultEventIndex(events: HeroEvent[]) {
  let index = 0
  events.forEach((entry, i) => {
    if (entry.upcoming) index = i
  })
  return index
}

export function Hero({ data, timeline }: HeroProps) {
  const events = useMemo(() => timeline?.events ?? [], [timeline])
  const months = useMemo(() => timeline?.months ?? [], [timeline])
  const heroRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [reduced, setReduced] = useState(false)
  const [mode, setMode] = useState<ShowcaseMode>(events.length > 0 ? 'events' : 'projects')
  const [activeIndex, setActiveIndex] = useState(() => defaultEventIndex(timeline?.events ?? []))
  const [cycle, setCycle] = useState(0)
  const [hoverPaused, setHoverPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [memberHovered, setMemberHovered] = useState(false)
  const modeRefs = useRef<Partial<Record<ShowcaseMode, HTMLButtonElement | null>>>({})
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })

  useEffect(() => setReduced(Boolean(prefersReducedMotion)), [prefersReducedMotion])

  const items = useMemo(
    () => (mode === 'events' ? events.map(eventItem) : HERO_APPS.map(projectItem)),
    [mode, events]
  )
  const current = activeIndex % items.length
  const activeEvent = mode === 'events' ? events[current] : undefined
  const activeApp = mode === 'projects' ? HERO_APPS[current] : undefined
  const paused = reduced || hoverPaused || userPaused
  const titleLines = data?.titleLines?.length ? data.titleLines : FALLBACK_TITLE
  const hasDescription = Boolean(data?.description && data.description.length > 0)
  const announcements = data?.showAnnouncements ? data.announcements ?? [] : []
  const modes: ShowcaseMode[] = events.length > 0 ? ['events', 'projects'] : ['projects']

  const select = useCallback((index: number) => {
    setActiveIndex(index)
    setCycle((value) => value + 1)
  }, [])

  const advance = useCallback(() => {
    setActiveIndex((index) => (index + 1) % items.length)
    setCycle((value) => value + 1)
  }, [items.length])

  useIsomorphicLayoutEffect(() => {
    const measure = () => {
      const button = modeRefs.current[mode]
      if (button) setPill({ x: button.offsetLeft, width: button.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [mode])

  const switchMode = (next: ShowcaseMode) => {
    if (next === mode) return
    setMode(next)
    setActiveIndex(next === 'events' ? defaultEventIndex(events) : 0)
    setCycle((value) => value + 1)
  }

  const activeMonth = activeEvent ? months.find((month) => month.key === activeEvent.monthKey) : undefined
  const railEntries: RailEntry[] = months.map((month) => {
    const inMonth = events.filter((entry) => entry.monthKey === month.key)
    return {
      key: month.key,
      title: month.label,
      detail:
        inMonth.length === 0
          ? 'No events this month'
          : `${inMonth.length} ${inMonth.length === 1 ? 'event' : 'events'}`,
      lines: inMonth.slice(0, 4).map((entry) => entry.event.title),
      short: month.short,
      enabled: inMonth.length > 0,
      target: events.findIndex((entry) => entry.monthKey === month.key),
    }
  })
  const activeRailKey = activeEvent?.monthKey

  const pauseHandlers = {
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHoverPaused(true)
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHoverPaused(false)
    },
  }

  const headingClass =
    'group mt-5 flex h-[1.2em] w-fit max-w-full items-center font-extrabold leading-none tracking-[-0.03em] text-white no-underline text-[clamp(1.6rem,2.5vw,2.6rem)]'

  return (
    <>
      {announcements.length > 0 && (
        <AnnouncementBanner announcements={announcements} cycleDuration={data?.announcementCycleDuration} />
      )}
      <section ref={heroRef} className="relative isolate flex min-h-[100svh] w-full flex-col overflow-hidden">
        <HeroBackdrop data={data} scrollProgress={scrollYProgress} />

        <div className="mx-auto grid w-full max-w-[96rem] flex-1 grid-cols-1 items-center gap-14 px-5 pb-10 pt-32 sm:px-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-16 lg:px-12 lg:pt-36 xl:gap-24">
          <motion.div
            className="order-2 hidden min-w-0 md:block lg:order-1"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: EASE_OUT }}
            {...pauseHandlers}
          >
            <div className="flex flex-col items-center pr-14 text-center">
              {modes.length > 1 && (
                <div
                  role="tablist"
                  aria-label="Showcase"
                  className="relative inline-flex rounded-full bg-[#141414]/70 p-1 ring-1 ring-white/10 backdrop-blur-sm"
                >
                  {pill && (
                    <motion.span
                      aria-hidden
                      className="absolute bottom-1 left-0 top-1 rounded-full bg-accent"
                      initial={false}
                      animate={{ x: pill.x, width: pill.width }}
                      transition={{ duration: reduced ? 0 : 0.45, ease: EASE_OVERLAY }}
                    />
                  )}
                  {modes.map((option) => {
                    const selected = option === mode
                    return (
                      <button
                        key={option}
                        ref={(node) => {
                          modeRefs.current[option] = node
                        }}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="hero-app-stage"
                        onClick={() => switchMode(option)}
                        className="relative cursor-pointer rounded-full px-5 py-2 text-sm font-bold outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        <span
                          className={`relative transition-colors duration-300 ${
                            selected ? 'text-accent-foreground' : 'text-white/75 hover:text-white'
                          }`}
                        >
                          {SHOWCASE_LABELS[option]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {activeApp && (
                <a
                  href={activeApp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${activeApp.name} at ${activeApp.host}`}
                  className={headingClass}
                >
                  <RollingSubdomain word={activeApp.hero.subdomain} reduced={reduced} />
                  <span>.monashcoding.com</span>
                  <span className="ml-3 inline-flex h-[0.95em] items-center rounded-full bg-white/[0.14] px-[0.26em] text-[0.42em] font-extrabold uppercase tracking-[0.06em] text-white transition-[background-color,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-accent group-hover:text-accent-foreground">
                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:ml-[0.35em] group-hover:mr-[0.2em] group-hover:max-w-[3em] group-hover:opacity-100">
                      Go
                    </span>
                    <ArrowUpRight aria-hidden strokeWidth={2.75} className="size-[1.45em]" />
                  </span>
                </a>
              )}
              {activeEvent && activeMonth && (
                <p className={headingClass}>
                  <RollingSubdomain word={activeMonth.label} reduced={reduced} />
                </p>
              )}
            </div>

            <div className="mt-4 flex items-stretch gap-2">
              <div className="relative min-w-0 flex-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={mode}
                    className="w-full"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  >
                    <AppStage
                      items={items}
                      activeIndex={current}
                      reduced={reduced}
                      userPaused={userPaused}
                      progressPaused={paused}
                      cycle={cycle}
                      dwellSeconds={DWELL_SECONDS}
                      onAdvance={advance}
                      onSelect={select}
                      onTogglePause={() => setUserPaused((value) => !value)}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              {mode === 'events' ? (
                <ShowcaseRail entries={railEntries} activeKey={activeRailKey} onPick={select} />
              ) : (
                <div aria-hidden className="w-14 shrink-0" />
              )}
            </div>
          </motion.div>

          <div className="order-1 flex min-w-0 flex-col lg:order-2">
            <TitleLockup lines={titleLines} />

            <motion.div
              className="mt-7 max-w-[52ch] text-[15px] leading-[1.8] text-white/90 lg:mt-8 xl:text-[17px]"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: EASE_OUT }}
            >
              <RibbonBlock darkClass="text-[#252525]/90">
                {hasDescription ? <HeroDescription value={data!.description} /> : <FallbackDescription />}
              </RibbonBlock>
            </motion.div>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease: EASE_OUT }}
            >
              <div
                className="relative z-10 inline-flex"
                onMouseEnter={() => setMemberHovered(true)}
                onMouseLeave={() => setMemberHovered(false)}
              >
                <a
                  href={MEMBER_SIGNUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-md border-2 border-accent bg-accent px-7 py-3 text-sm font-extrabold uppercase tracking-[0.09em] text-accent-foreground no-underline transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/40"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[#252525] transition-transform duration-300 ease-out group-hover:translate-x-0" />
                  <span className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-[linear-gradient(120deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    Become a Member
                  </span>
                </a>
                <div className="pointer-events-none absolute -right-8 -top-20 -z-10">
                  <AnimatePresence>
                    {memberHovered && (
                      <motion.div
                        style={{ rotate: 20 }}
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 5 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      >
                        <Image src="/mascot/max-join-mac.svg" alt="" width={100} height={100} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button
                type="button"
                onClick={openAppLauncher}
                className="inline-flex items-center gap-2.5 rounded-md border-2 border-white/25 bg-[#1a1a1a]/60 px-5 py-3 text-sm font-bold uppercase tracking-[0.09em] text-white transition-[border-color,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-white/50"
              >
                All MAC apps
              </button>
            </motion.div>
          </div>
        </div>

      </section>
    </>
  )
}
