'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

/* ------------------------------------------------------------------ */
/*  Social receipts                                                    */
/* ------------------------------------------------------------------ */

const PLATFORM_PASTELS: Partial<Record<SocialPlatform, { fill: string; ink: string; action: string }>> = {
  instagram: { fill: '#FFD6E7', ink: '#D62976', action: 'Follow us' },
  discord: { fill: '#DCDDFF', ink: '#5865F2', action: 'Join the server' },
  linkedin: { fill: '#D2E6FA', ink: '#0A66C2', action: 'Follow the page' },
  youtube: { fill: '#FFD9D3', ink: '#E62117', action: 'Subscribe' },
  facebook: { fill: '#D9E3FF', ink: '#1877F2', action: 'Follow the page' },
  tiktok: { fill: '#C8F2EC', ink: '#111111', action: 'Follow us' },
  github: { fill: '#E6E1F2', ink: '#24292F', action: 'See our code' },
  twitter: { fill: '#DDE7EE', ink: '#111111', action: 'Follow us' },
  website: { fill: '#FFF0A3', ink: '#252525', action: 'Visit' },
  email: { fill: '#FFE6C7', ink: '#C5221F', action: 'Email us' },
}

function handleFrom(url?: string) {
  if (!url) return null
  try {
    const path = new URL(url).pathname.split('/').filter(Boolean)[0]
    return path && !path.startsWith('company') && !path.startsWith('channel') ? `@${path.replace(/^@/, '')}` : null
  } catch {
    return null
  }
}

function Barcode({ seed, color, className = 'h-7' }: { seed: string; color: string; className?: string }) {
  const bars: { x: number; w: number }[] = []
  let x = 0
  let hash = 7
  for (let i = 0; i < 34; i++) {
    hash = (hash * 31 + seed.charCodeAt(i % seed.length) + i) % 101
    const width = 1 + (hash % 3)
    if (i % 2 === 0) bars.push({ x, w: width })
    x += width + 1 + (hash % 2)
  }
  return (
    <svg viewBox={`0 0 ${x} 20`} preserveAspectRatio="none" className={`w-full ${className}`} aria-hidden>
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="20" fill={color} />
      ))}
    </svg>
  )
}

const receiptListVariants = {
  hidden: {},
  shown: {},
}

const receiptVariants = {
  hidden: { y: '-102%' },
  shown: (order: number) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.1 + order * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

function ReceiptCard({
  tile,
  index,
  count,
  variant,
}: {
  tile: CommunityTile
  index: number
  count: number
  variant: 'hanging' | 'grid'
}) {
  const palette = PLATFORM_PASTELS[tile.platform] ?? { fill: '#EDEDED', ink: '#252525', action: 'Follow us' }
  const Icon = PLATFORM_ICONS[tile.platform]
  const label = PLATFORM_LABELS[tile.platform] ?? tile.platform
  const handle = tile.platform === 'instagram' || tile.platform === 'tiktok' ? handleFrom(tile.url) : null
  const subtitle = tile.description || (handle ? `${palette.action} ${handle}` : palette.action)
  const rank = Math.min(index, count - 1 - index)
  const fromCenter = Math.floor((count - 1) / 2) - rank
  const live = Boolean(tile.url && !tile.isPlaceholder)

  const fullBody = (wrapperClass: string) => (
    <span className={wrapperClass}>
      {Icon && (
        <Icon
          size={120}
          className="pointer-events-none absolute -right-7 top-[38%] -z-10 opacity-[0.12] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6"
        />
      )}
      <span className="flex items-start justify-between">
        <span className="grid size-10 place-items-center rounded-full bg-white" style={{ color: palette.ink }}>
          {Icon ? <Icon size={20} /> : null}
        </span>
        <span className="grid size-8 place-items-center rounded-full bg-[#252525] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={palette.fill} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </span>
      </span>
      <span className="mt-4 block text-lg font-extrabold leading-tight tracking-[-0.02em] text-[#252525]">{label}</span>
      <span className="mt-0.5 block text-xs leading-snug text-[#252525]/70">{subtitle}</span>
      <span className="mt-auto block pt-5">
        <span className="flex items-center justify-between border-t-2 border-dashed border-[#252525]/25 pt-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#252525]/60">
          <span>No. {String(index + 1).padStart(2, '0')}</span>
          <span>Free</span>
        </span>
        <span className="mt-2 block opacity-75">
          <Barcode seed={tile.platform} color="#252525" />
        </span>
      </span>
    </span>
  )

  const compactBody = (
    <span className="flex h-full flex-col items-center xl:hidden">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white" style={{ color: palette.ink }}>
        {Icon ? <Icon size={18} /> : null}
      </span>
      <span
        className="mt-2.5 text-xs font-extrabold uppercase leading-none tracking-[0.14em] text-[#252525]"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {label}
      </span>
      <span className="mt-auto block w-full border-t-2 border-dashed border-[#252525]/25 pt-1.5 opacity-75">
        <Barcode seed={tile.platform} color="#252525" className="h-5" />
      </span>
    </span>
  )

  const slotShade = (
    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/20 to-transparent" />
  )

  const isGrid = variant === 'grid'
  const className = isGrid
    ? 'receipt-tear group relative isolate flex min-h-[14rem] flex-col overflow-hidden rounded-t-[18px] px-4 pb-7 pt-4 no-underline outline-none focus-visible:brightness-95'
    : 'receipt-tear group relative isolate flex h-[calc(var(--h-compact)+1.25rem)] flex-col overflow-hidden px-2.5 pb-5 pt-3 no-underline outline-none focus-visible:brightness-95 xl:h-[var(--h-full)] xl:px-4 xl:pb-7 xl:pt-4'
  const style = {
    backgroundColor: palette.fill,
    '--h-compact': `${12.5 + rank * 1.5}rem`,
    '--h-full': `${15.5 + rank * 2.5}rem`,
  } as React.CSSProperties
  const body = isGrid ? (
    fullBody('flex h-full flex-col')
  ) : (
    <>
      {slotShade}
      {compactBody}
      {fullBody('hidden h-full flex-col xl:flex')}
    </>
  )
  const inner = live ? (
    <a href={tile.url} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${subtitle}`} className={className} style={style}>
      {body}
    </a>
  ) : (
    <div className={`${className} opacity-60`} style={style}>
      {body}
    </div>
  )

  if (isGrid) {
    return (
      <motion.li
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: (index % 2) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        {inner}
      </motion.li>
    )
  }

  return (
    <motion.li className="min-w-0 flex-1 xl:w-[9.5rem] xl:flex-none" variants={receiptVariants} custom={fromCenter}>
      <motion.div whileHover={{ y: 10 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
        {inner}
      </motion.div>
    </motion.li>
  )
}

function ReceiptStrip({
  tiles,
  reduced,
  heading,
  subheading,
}: {
  tiles: CommunityTile[]
  reduced: boolean
  heading: string
  subheading: string
}) {
  return (
    <>
      <div className="relative z-0 mx-auto hidden w-[var(--slot-width,100%)] max-w-full overflow-hidden md:block">
        <motion.ul
          className="flex gap-2.5 px-3 pb-6 xl:justify-center xl:gap-3.5"
          variants={receiptListVariants}
          initial={reduced ? false : 'hidden'}
          whileInView="shown"
          viewport={{ once: true, amount: 0.05 }}
        >
          {tiles.map((tile, index) => (
            <ReceiptCard key={tile._key} tile={tile} index={index} count={tiles.length} variant="hanging" />
          ))}
        </motion.ul>
      </div>

      <div className="mt-14 px-5 md:hidden">
        <h2 className="text-[2.1rem] font-extrabold leading-none tracking-[-0.03em] text-white">{heading}</h2>
        <p className="mt-2 text-sm text-white/65">{subheading}</p>
        <ul className="mt-6 grid grid-cols-2 gap-3">
          {tiles.map((tile, index) => (
            <ReceiptCard key={tile._key} tile={tile} index={index} count={tiles.length} variant="grid" />
          ))}
        </ul>
      </div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Media cards                                                        */
/* ------------------------------------------------------------------ */

function StatChip({ children, fill }: { children: React.ReactNode; fill: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[0.68rem] font-bold text-[#252525]"
      style={{ backgroundColor: fill }}
    >
      {children}
    </span>
  )
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="receipt-tear group block h-full rounded-t-[26px] bg-[#1E1E1E] p-2 pb-5 no-underline transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
    >
      <div className="relative aspect-video overflow-hidden rounded-[20px]">
        <img src={video.thumbnail} alt={video.title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-2.5 top-2.5">
          <StatChip fill="#FFD9D3">{video.year}</StatChip>
        </span>
        <span className="absolute bottom-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#252525" className="ml-0.5" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </div>
      <div className="px-2.5 pb-2 pt-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-white/90">{video.title}</p>
        {video.views > 0 && <p className="mt-1 text-xs text-white/55">{video.views.toLocaleString()} views</p>}
      </div>
    </a>
  )
}

function InstagramReelCard({ reel }: { reel: InstagramReel }) {
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      className="receipt-tear group block h-full rounded-t-[26px] bg-[#1E1E1E] p-2 pb-5 no-underline transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5"
    >
      <div className="relative aspect-square overflow-hidden rounded-[20px]">
        <img src={reel.thumbnail} alt={reel.caption} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-2.5 top-2.5">
          <StatChip fill="#FFD6E7">
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#D62976" aria-hidden>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              {reel.likes}
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#252525" fillOpacity=".7" aria-hidden>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {reel.comments}
            </span>
          </StatChip>
        </span>
        {reel.pinned && (
          <span className="absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full bg-accent" title="Pinned">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#252525" aria-hidden>
              <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
            </svg>
          </span>
        )}
        {reel.type === 'reel' && (
          <span className="absolute bottom-2.5 right-2.5 grid size-9 place-items-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#252525" className="ml-0.5" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        )}
      </div>
      <div className="px-2.5 pb-2 pt-3">
        <p className="line-clamp-2 text-sm leading-snug text-white/90">{reel.caption || `Instagram ${reel.type}`}</p>
      </div>
    </a>
  )
}

function BlockHeader({
  title,
  note,
  fill,
  icon,
  action,
}: {
  title: string
  note?: string
  fill: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: fill }}>
          {icon}
        </span>
        <div>
          <h3 className="text-[clamp(1.3rem,2vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-white">{title}</h3>
          {note && <p className="mt-0.5 text-sm text-white/60">{note}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

function PillButton({
  children,
  onClick,
  disabled,
  fill,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  fill: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="mx-auto mt-6 flex items-center justify-center gap-2 rounded-full px-6 py-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#252525] transition-transform duration-300 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      style={{ backgroundColor: fill }}
    >
      {children}
    </button>
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
/*  Section                                                            */
/* ------------------------------------------------------------------ */

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

export function CommunityExtras({ data, socialLinks = [], youtubeVideos = [] }: CommunitySectionProps) {
  const prefersReducedMotion = useReducedMotion()
  const allowedPlatforms = data?.platforms ?? DEFAULT_PLATFORMS

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

  const mountedRef = useRef(false)
  useEffect(() => {
    if (reelEntries.length > 0 && !mountedRef.current) {
      mountedRef.current = true
      loadReels(0)
    }
  }, [reelEntries, loadReels])

  const hasVideos = youtubeVideos.length > 0
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const filteredLinks = socialLinks.filter((link) => allowedPlatforms.includes(link.platform))

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

  const instagramLink = socialLinks.find((link) => link.platform === 'instagram')?.url
  const youtubeLink = socialLinks.find((link) => link.platform === 'youtube')?.url
  const InstagramIcon = PLATFORM_ICONS.instagram
  const YouTubeIcon = PLATFORM_ICONS.youtube

  const years = useMemo(() => {
    return [...new Set(youtubeVideos.map((v) => v.year))].sort((a, b) => b - a)
  }, [youtubeVideos])

  const filteredVideos = useMemo(() => {
    if (selectedYear === 'all') return youtubeVideos
    return youtubeVideos.filter((v) => v.year === selectedYear)
  }, [youtubeVideos, selectedYear])

  const externalLink = (href: string | undefined, label: string) =>
    href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white no-underline transition-colors hover:border-white/40"
      >
        {label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M7 17 17 7M8 7h9v9" />
        </svg>
      </a>
    ) : null

  const spinner = (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )

  return (
    <>
      <ReceiptStrip
        tiles={tiles}
        reduced={Boolean(prefersReducedMotion)}
        heading={data?.heading ?? 'Our Community'}
        subheading={data?.subheading ?? 'Connect with us on social media'}
      />

      {(hasReels || hasVideos) && (
        <div className="mx-auto mt-14 flex max-w-[1240px] flex-col gap-16 px-6 md:mt-20 md:px-8">
          {hasReels && (
            <div>
              <BlockHeader
                title="Latest reels"
                note="Straight from our Instagram"
                fill="#FFD6E7"
                icon={InstagramIcon ? <InstagramIcon size={20} className="text-[#D62976]" /> : null}
                action={externalLink(instagramLink, 'Open Instagram')}
              />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {loadedReels.map((reel) => (
                  <div key={reel.shortcode} className="animate-fade-in-up">
                    <InstagramReelCard reel={reel} />
                  </div>
                ))}
              </div>
              {hasMoreReels && (
                <PillButton onClick={() => loadReels(fetchedUpTo)} disabled={reelsLoading} fill="#FFD6E7">
                  {reelsLoading ? (
                    <>
                      {spinner}
                      Loading
                    </>
                  ) : (
                    'Load more reels'
                  )}
                </PillButton>
              )}
            </div>
          )}

          {hasVideos && (
            <div>
              <BlockHeader
                title="Videos"
                note="From our YouTube channel"
                fill="#FFD9D3"
                icon={YouTubeIcon ? <YouTubeIcon size={20} className="text-[#E62117]" /> : null}
                action={
                  <div className="flex flex-wrap items-center gap-2">
                    {years.length > 1 && (
                      <div className="flex flex-wrap gap-1.5 rounded-full bg-white/[0.06] p-1">
                        {(['all', ...years] as const).map((year) => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => setSelectedYear(year)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                              selectedYear === year ? 'bg-[#FFD9D3] text-[#252525]' : 'text-white/70 hover:text-white'
                            }`}
                          >
                            {year === 'all' ? 'All' : year}
                          </button>
                        ))}
                      </div>
                    )}
                    {externalLink(youtubeLink, 'Open YouTube')}
                  </div>
                }
              />
              {filteredVideos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {filteredVideos.map((video) => (
                    <VideoCard key={video.videoId} video={video} />
                  ))}
                </div>
              ) : (
                <p className="rounded-[26px] border border-dashed border-white/20 py-14 text-center text-white/55">
                  No videos to display.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export function CommunitySection(props: CommunitySectionProps) {
  const heading = props.data?.heading ?? 'Our Community'
  const subheading = props.data?.subheading ?? 'Connect with us on social media'

  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      className="overflow-hidden"
      contentClassName="relative py-[clamp(5rem,9vw,7.5rem)]"
    >
      <FizzleEdge side="left" />
      <FizzleEdge side="right" />
      <div className="mx-auto mb-10 flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-6 md:px-8">
        <h2 className="text-[clamp(2.2rem,4.6vw,3.8rem)] font-extrabold leading-[1.01] tracking-[-0.03em] text-foreground">
          {heading}
        </h2>
        <p className="max-w-[26rem] text-sm leading-relaxed text-white/65 md:text-base">{subheading}</p>
      </div>
      <CommunityExtras {...props} />
    </RibbonAwareSection>
  )
}
