'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { CommunitySectionData, SocialLink } from '@/lib/sanity/types'
import type { YouTubeVideo } from '@/lib/youtube/feed'
import type { InstagramReel } from '@/lib/instagram/feed'
import {
  PLATFORM_ICONS,
  PLATFORM_LABELS,
  SocialPlatform,
} from '@/lib/socialPlatforms'

const DEFAULT_PLATFORMS: SocialPlatform[] = [
  'instagram',
  'youtube',
  'tiktok',
  'facebook',
  'linkedin',
  'discord',
]

const PLATFORM_ACCENTS: Partial<Record<SocialPlatform, { color: string }>> = {
  instagram: { color: '#E1306C' },
  youtube: { color: '#FF0000' },
  tiktok: { color: '#00F2EA' },
  facebook: { color: '#1877F2' },
  linkedin: { color: '#0A66C2' },
  discord: { color: '#5865F2' },
  email: { color: '#EA4335' },
}

/* ------------------------------------------------------------------ */
/*  Interactive 3-D tilt card with cursor-tracking spotlight           */
/* ------------------------------------------------------------------ */

interface HoverState {
  x: number
  y: number
  active: boolean
}

export function SocialTiltCard({
  platform,
  url,
  isPlaceholder,
  index,
  description,
}: {
  platform: SocialPlatform
  url?: string
  isPlaceholder: boolean
  index: number
  description?: string
}) {
  const [hover, setHover] = useState<HoverState>({
    x: 0.5,
    y: 0.5,
    active: false,
  })

  const Icon = PLATFORM_ICONS[platform]
  const label = PLATFORM_LABELS[platform]
  const accent = PLATFORM_ACCENTS[platform] ?? { color: '#FFE330' }

  const tiltX = hover.active && !isPlaceholder ? (hover.y - 0.5) * -14 : 0
  const tiltY = hover.active && !isPlaceholder ? (hover.x - 0.5) * 14 : 0

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setHover({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
      active: true,
    })
  }

  const card = (
    <motion.div
      className="group relative"
      style={{ perspective: '800px' }}
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.55,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover({ x: 0.5, y: 0.5, active: false })}
    >
      <div
        className="relative h-full overflow-hidden rounded-lg"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hover.active && !isPlaceholder ? 1.03 : 1})`,
          transition:
            'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
          border: 'none',
          backgroundColor: 'rgba(28,28,28,0.8)',
        }}
      >
        <div
          className="relative z-10 flex flex-col justify-between p-6"
          style={{
            minHeight: '11rem',
            transform: 'translateZ(20px)',
          }}
        >
          <div className="flex items-start justify-between">
            <div
              style={{
                color:
                  hover.active && !isPlaceholder
                    ? accent.color
                    : isPlaceholder
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.6)',
                transform:
                  hover.active && !isPlaceholder
                    ? 'scale(1.14) rotate(-5deg)'
                    : 'scale(1) rotate(0deg)',
                transition:
                  'color 0.3s, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s',
                filter: 'none',
              }}
            >
              <Icon size={34} />
            </div>

            {!isPlaceholder && (
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-all duration-300"
                style={{
                  backgroundColor: hover.active
                    ? `${accent.color}15`
                    : 'rgba(255,255,255,0.04)',
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            )}
          </div>

          <div className="mt-auto pt-4">
            <p
              className={`text-[1.1rem] font-semibold leading-tight ${isPlaceholder ? 'text-white/35' : 'text-foreground'}`}
            >
              {label}
            </p>
            <p
              className={`mt-1.5 text-[0.82rem] break-all ${isPlaceholder ? 'text-white/20' : 'text-white/50'}`}
            >
              {isPlaceholder ? 'Coming soon' : (description || 'Follow us')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (url) {
    const isMailto = url.toLowerCase().startsWith('mailto:')
    return (
      <a
        href={url}
        {...(!isMailto && { target: '_blank', rel: 'noopener noreferrer' })}
        className="block no-underline"
      >
        {card}
      </a>
    )
  }

  return card
}

/* ------------------------------------------------------------------ */
/*  YouTube video card                                                 */
/* ------------------------------------------------------------------ */

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full overflow-hidden rounded-lg bg-[rgba(28,28,28,0.8)] no-underline"
    >
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors duration-300 group-hover:bg-black/10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#252525" className="ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white/85">{video.title}</p>
          <p className="mt-0.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-white/45">
            {video.views > 0 ? `${video.views.toLocaleString()} views` : 'YouTube video'}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-white/65">
          {video.year}
        </span>
      </div>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Instagram reel card                                                */
/* ------------------------------------------------------------------ */

function InstagramReelCard({ reel }: { reel: InstagramReel }) {
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full overflow-hidden rounded-lg bg-[rgba(28,28,28,0.8)] no-underline"
    >
      <div className="relative w-full overflow-hidden" style={{ paddingBottom: '100%' }}>
        <img
          src={reel.thumbnail}
          alt={reel.caption}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Likes & comments overlay - top-left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-2.5 rounded-lg bg-black/55 px-2.5 py-1.5 backdrop-blur-sm">
          <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-white/90">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-red-400">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {reel.likes}
          </span>
          <span className="flex items-center gap-1 text-[0.68rem] font-semibold text-white/90">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {reel.comments}
          </span>
        </div>
        {/* Pinned indicator - top-right */}
        {reel.pinned && (
          <div className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-accent shadow-lg">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#252525">
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          </div>
        )}
        {/* Play icon for reels */}
        {reel.type === 'reel' && (
          <div className="absolute right-2.5 bottom-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#252525" className="ml-0.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {/* Caption */}
      <div className="px-4 py-3">
        <p className="line-clamp-2 text-sm leading-snug text-white/85">
          {reel.caption || `Instagram ${reel.type}`}
        </p>
      </div>
    </a>
  )
}

/* ------------------------------------------------------------------ */
/*  Yellow fizzle/sparkle canvas on the left or right edge             */
/* ------------------------------------------------------------------ */

function FizzleEdge({ side }: { side: 'left' | 'right' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x: number; y: number; r: number; speed: number; opacity: number; phase: number }[] = []

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    const init = () => {
      resize()
      particles.length = 0
      const count = Math.floor(canvas.height / 8)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          speed: Math.random() * 0.3 + 0.1,
          opacity: Math.random() * 0.6 + 0.1,
          phase: Math.random() * Math.PI * 2,
        })
      }
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        const flicker = Math.sin(t * 0.001 * p.speed * 3 + p.phase) * 0.5 + 0.5
        const alpha = p.opacity * flicker

        const edgeFade = side === 'left'
          ? 1 - (p.x / canvas.width) * 0.8
          : (p.x / canvas.width) * 0.8 + 0.2

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 227, 48, ${alpha * edgeFade})`
        ctx.fill()

        p.y -= p.speed
        if (p.y < -2) {
          p.y = canvas.height + 2
          p.x = Math.random() * canvas.width
        }
      }
      animId = requestAnimationFrame(draw)
    }

    init()
    animId = requestAnimationFrame(draw)

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [side])

  return (
    <div
      className={`absolute top-0 bottom-0 w-24 md:w-40 pointer-events-none z-[1] ${
        side === 'left' ? 'left-0' : 'right-0'
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Desktop collapsible panel with vertical label                      */
/* ------------------------------------------------------------------ */

function CollapsiblePanel({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex">
        {/* Vertical label strip */}
        <button
          onClick={onToggle}
          className="relative flex-shrink-0 w-16 flex items-center justify-center cursor-pointer bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300 py-6"
        >
          <span
            className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-white/60 whitespace-nowrap transition-colors duration-300 hover:text-accent"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {label}
          </span>
          {isOpen && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="absolute bottom-4 text-white/40"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          )}
        </button>

        {/* Panel content — always mounted, height animated via grid trick */}
        <div className="relative flex-1 min-w-0">
          <div
            className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>

          {/* "Click to open" hint when collapsed — vertically centered */}
          <button
            onClick={onToggle}
            className={`absolute inset-0 flex items-center justify-center text-[0.75rem] font-semibold tracking-[0.15em] uppercase text-white/35 hover:text-accent cursor-pointer transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            Click to open
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.06 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const REELS_PER_PAGE = 12

interface CommunitySectionProps {
  data?: CommunitySectionData
  socialLinks?: SocialLink[]
  youtubeVideos?: YouTubeVideo[]
}

interface CommunityTile {
  _key: string
  platform: SocialPlatform
  url?: string
  description?: string
  isPlaceholder: boolean
}

export function CommunitySection({
  data,
  socialLinks = [],
  youtubeVideos = [],
}: CommunitySectionProps) {
  const heading = data?.heading ?? 'Our Community'
  const subheading = data?.subheading ?? 'Connect with us on social media'
  const allowedPlatforms = data?.platforms ?? DEFAULT_PLATFORMS

  // Instagram reels - fetched client-side in batches from Sanity entries
  const reelEntries = useMemo(() => {
    const entries = data?.instagramReels ?? []
    return [...entries].reverse().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))
  }, [data?.instagramReels])

  const [loadedReels, setLoadedReels] = useState<InstagramReel[]>([])
  const [reelsLoading, setReelsLoading] = useState(false)
  const [fetchedUpTo, setFetchedUpTo] = useState(0)
  const loadingRef = useRef(false)

  const hasMoreReels = fetchedUpTo < reelEntries.length
  const hasReels = reelEntries.length > 0

  const loadReels = useCallback(async (startFrom: number) => {
    if (loadingRef.current) return
    if (startFrom >= reelEntries.length) return
    loadingRef.current = true
    setReelsLoading(true)

    const nextEnd = Math.min(startFrom + REELS_PER_PAGE, reelEntries.length)
    const nextBatch = reelEntries.slice(startFrom, nextEnd)
    setFetchedUpTo(nextEnd)

    try {
      const res = await fetch('/api/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: nextBatch.map((e) => e.url) }),
      })
      const { reels } = (await res.json()) as { reels: InstagramReel[] }
      const merged = reels.map((reel) => {
        const entry = nextBatch.find((e) => e.url === reel.url)
        return { ...reel, pinned: entry?.pinned ?? false }
      })
      setLoadedReels((prev) => [...prev, ...merged])
    } catch {
      // Silently skip failed batch
    }
    loadingRef.current = false
    setReelsLoading(false)
  }, [reelEntries])

  // Load first batch on mount
  const mountedRef = useRef(false)
  useEffect(() => {
    if (reelEntries.length > 0 && !mountedRef.current) {
      mountedRef.current = true
      loadReels(0)
    }
  }, [reelEntries, loadReels])
  const hasVideos = youtubeVideos.length > 0
  const [socialsOpen, setSocialsOpen] = useState(true)
  const [reelsOpen, setReelsOpen] = useState(true)
  const [videosOpen, setVideosOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'socials' | 'reels' | 'videos'>('socials')
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const filteredLinks = socialLinks.filter((link) =>
    allowedPlatforms.includes(link.platform)
  )

  const tiles: CommunityTile[] =
    filteredLinks.length > 0
      ? filteredLinks.map((link) => ({
          _key: link._key,
          platform: link.platform,
          url: link.url,
          description: link.description,
          isPlaceholder: false,
        }))
      : allowedPlatforms.map((platform) => ({
          _key: platform,
          platform,
          isPlaceholder: true,
        }))

  const years = useMemo(() => {
    return [...new Set(youtubeVideos.map((v) => v.year))].sort((a, b) => b - a)
  }, [youtubeVideos])

  const filteredVideos = useMemo(() => {
    if (selectedYear === 'all') return youtubeVideos
    return youtubeVideos.filter((v) => v.year === selectedYear)
  }, [youtubeVideos, selectedYear])

  /* ---- Mobile content (tabs) ---- */
  const mobileTabs = useMemo(() => {
    const tabs: ('socials' | 'reels' | 'videos')[] = ['socials']
    if (hasReels) tabs.push('reels')
    if (hasVideos) tabs.push('videos')
    return tabs
  }, [hasReels, hasVideos])

  const tabLabels: Record<'socials' | 'reels' | 'videos', string> = {
    socials: 'Socials',
    reels: 'Reels',
    videos: 'Videos',
  }

  const mobileContent = (
    <div className="lg:hidden">
      {/* Mobile tabs */}
      {mobileTabs.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="inline-flex gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1.5">
            {mobileTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative overflow-hidden rounded-md px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-300 ${
                  activeTab === tab
                    ? 'text-[#252525]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="community-tab-mobile"
                    className="absolute inset-0 rounded-md bg-accent"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tabLabels[tab]}
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'videos' && years.length > 1 && (
            <label className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-white/60">
              Year
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                  )
                }
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.7rem] tracking-[0.08em] text-white outline-none focus:border-accent"
              >
                <option value="all">All</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      )}

      {/* Mobile content */}
      <AnimatePresence mode="wait">
        {activeTab === 'socials' && (
          <motion.div
            key="socials-mobile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {tiles.map((tile, index) => (
              <SocialTiltCard
                key={tile._key}
                platform={tile.platform}
                url={tile.url}
                description={tile.description}
                isPlaceholder={tile.isPlaceholder}
                index={index}
              />
            ))}
          </motion.div>
        )}

        {activeTab === 'reels' && (
          <motion.div
            key="reels-mobile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {loadedReels.map((reel) => (
                <div key={reel.shortcode} className="animate-fade-in-up">
                  <InstagramReelCard reel={reel} />
                </div>
              ))}
            </div>
            {hasMoreReels && (
              <button
                onClick={() => loadReels(fetchedUpTo)}
                disabled={reelsLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/3 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-white/60 transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-60"
              >
                {reelsLoading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Load more reels'
                )}
              </button>
            )}
          </motion.div>
        )}

        {activeTab === 'videos' && (
          <motion.div
            key="videos-mobile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video.videoId}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.42, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <VideoCard video={video} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg border border-dashed border-white/20 bg-white/[0.02] py-14 text-center text-white/45">
                No videos to display.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  /* ---- Desktop content (collapsible panels with vertical labels) ---- */
  const desktopContent = (
    <div className="hidden lg:flex flex-col gap-4">
      {/* Socials panel (always open, no collapse) */}
      <div className="rounded-xl overflow-hidden">
        <div className="flex">
          <div className="relative shrink-0 w-16 flex items-center justify-center bg-white/3 py-6">
            <span
              className="text-[0.8rem] font-bold uppercase tracking-[0.2em] text-white/60 whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Socials
            </span>
          </div>
          <div className="flex-1 min-w-0 p-6">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(tiles.length, 4)}, 1fr)` }}>
              {tiles.map((tile, index) => (
                <SocialTiltCard
                  key={tile._key}
                  platform={tile.platform}
                  url={tile.url}
                  isPlaceholder={tile.isPlaceholder}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reels panel */}
      {hasReels && (
        <CollapsiblePanel
          label="Reels"
          isOpen={reelsOpen}
          onToggle={() => setReelsOpen((v) => !v)}
        >
          <div className="grid grid-cols-4 gap-4">
            {loadedReels.map((reel) => (
              <div key={reel.shortcode} className="animate-fade-in-up transition-transform duration-300 hover:-translate-y-1">
                <InstagramReelCard reel={reel} />
              </div>
            ))}
          </div>
          {hasMoreReels && (
            <button
              onClick={() => loadReels(fetchedUpTo)}
              disabled={reelsLoading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white/3 py-3 text-xs font-semibold tracking-[0.12em] uppercase text-white/60 transition-colors hover:text-accent disabled:pointer-events-none disabled:opacity-60"
            >
              {reelsLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                'Load more reels'
              )}
            </button>
          )}
        </CollapsiblePanel>
      )}

      {/* Videos panel */}
      {hasVideos && (
        <CollapsiblePanel
          label="Videos"
          isOpen={videosOpen}
          onToggle={() => setVideosOpen((v) => !v)}
        >
          {years.length > 1 && (
            <div className="mb-4">
              <label className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-white/60">
                Year
                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(
                      e.target.value === 'all' ? 'all' : Number(e.target.value)
                    )
                  }
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[0.7rem] tracking-[0.08em] text-white outline-none focus:border-accent"
                >
                  <option value="all">All</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.42, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                >
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] py-14 text-center text-white/45">
              No videos to display.
            </p>
          )}
        </CollapsiblePanel>
      )}
    </div>
  )

  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      className="overflow-hidden"
      contentClassName="relative py-[clamp(5.8rem,10vw,8.2rem)] px-6 md:px-8"
    >
      <FizzleEdge side="left" />
      <FizzleEdge side="right" />
      <motion.div
        className="relative mx-auto max-w-[1240px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.14 }}
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="space-y-3">
            <h2 className="text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] text-foreground">
              {heading}
            </h2>
          </div>
          <p className="max-w-[26rem] text-sm leading-relaxed text-white/55 md:text-base">
            {subheading}
          </p>
        </motion.div>

        {/* Desktop: collapsible panels | Mobile: tabs */}
        <motion.div variants={itemVariants}>
          {desktopContent}
          {mobileContent}
        </motion.div>
      </motion.div>
    </RibbonAwareSection>
  )
}
