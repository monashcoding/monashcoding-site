'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { CommunitySectionData, SocialLink } from '@/lib/sanity/types'
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

const PLATFORM_ACCENTS: Partial<
  Record<SocialPlatform, { color: string; glow: string }>
> = {
  instagram: { color: '#E1306C', glow: 'rgba(225,48,108,0.35)' },
  youtube: { color: '#FF0000', glow: 'rgba(255,0,0,0.28)' },
  tiktok: { color: '#00F2EA', glow: 'rgba(0,242,234,0.28)' },
  facebook: { color: '#1877F2', glow: 'rgba(24,119,242,0.3)' },
  linkedin: { color: '#0A66C2', glow: 'rgba(10,102,194,0.3)' },
  discord: { color: '#5865F2', glow: 'rgba(88,101,242,0.35)' },
}

/* ------------------------------------------------------------------ */
/*  Interactive 3-D tilt card with cursor-tracking spotlight           */
/* ------------------------------------------------------------------ */

interface HoverState {
  x: number
  y: number
  active: boolean
}

function SocialTiltCard({
  platform,
  url,
  isPlaceholder,
  index,
}: {
  platform: SocialPlatform
  url?: string
  isPlaceholder: boolean
  index: number
}) {
  const [hover, setHover] = useState<HoverState>({
    x: 0.5,
    y: 0.5,
    active: false,
  })

  const Icon = PLATFORM_ICONS[platform]
  const label = PLATFORM_LABELS[platform]
  const accent = PLATFORM_ACCENTS[platform] ?? {
    color: '#FFE330',
    glow: 'rgba(255,227,48,0.3)',
  }

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
        className="relative h-full overflow-hidden rounded-2xl backdrop-blur-sm"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${hover.active && !isPlaceholder ? 1.03 : 1})`,
          transition:
            'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.4s ease, box-shadow 0.4s ease',
          transformStyle: 'preserve-3d',
          border: `1px solid ${hover.active && !isPlaceholder ? `${accent.color}44` : 'rgba(255,255,255,0.08)'}`,
          backgroundColor: 'rgba(28,28,28,0.8)',
          boxShadow:
            hover.active && !isPlaceholder
              ? `0 25px 50px rgba(0,0,0,0.4), 0 0 40px ${accent.glow}`
              : '0 12px 32px rgba(0,0,0,0.3)',
        }}
      >
        {/* Cursor-following spotlight */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${hover.x * 100}% ${hover.y * 100}%, ${accent.glow} 0%, transparent 55%)`,
            opacity: hover.active && !isPlaceholder ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Content — translated forward for parallax depth */}
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
                filter:
                  hover.active && !isPlaceholder
                    ? `drop-shadow(0 0 14px ${accent.glow})`
                    : 'none',
              }}
            >
              <Icon size={34} />
            </div>

            {!isPlaceholder && (
              <span
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-all duration-300"
                style={{
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: hover.active
                    ? `${accent.color}55`
                    : 'rgba(255,255,255,0.12)',
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
              className={`mt-1.5 text-[0.82rem] ${isPlaceholder ? 'text-white/20' : 'text-white/50'}`}
            >
              {isPlaceholder ? 'Coming soon' : 'Follow us'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block no-underline"
      >
        {card}
      </a>
    )
  }

  return card
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

interface CommunitySectionProps {
  data?: CommunitySectionData
  socialLinks?: SocialLink[]
}

interface CommunityTile {
  _key: string
  platform: SocialPlatform
  url?: string
  isPlaceholder: boolean
}

export function CommunitySection({
  data,
  socialLinks = [],
}: CommunitySectionProps) {
  const heading = data?.heading ?? 'Our Community'
  const subheading = data?.subheading ?? 'Connect with us on social media'
  const allowedPlatforms = data?.platforms ?? DEFAULT_PLATFORMS

  const filteredLinks = socialLinks.filter((link) =>
    allowedPlatforms.includes(link.platform)
  )

  const tiles: CommunityTile[] =
    filteredLinks.length > 0
      ? filteredLinks.map((link) => ({
          _key: link._key,
          platform: link.platform,
          url: link.url,
          isPlaceholder: false,
        }))
      : allowedPlatforms.map((platform) => ({
          _key: platform,
          platform,
          isPlaceholder: true,
        }))

  return (
    <RibbonAwareSection
      backgroundClassName="bg-blue"
      className="overflow-hidden"
      contentClassName="relative py-[clamp(5.8rem,10vw,8.2rem)] px-6 md:px-8"
    >
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
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-accent/45 bg-black/25 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-accent">
              Community channels
            </span>
            <h2 className="text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-[1.01] text-foreground">
              {heading}
            </h2>
          </div>
          <p className="max-w-[26rem] text-sm leading-relaxed text-white/55 md:text-base">
            {subheading}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </motion.div>
    </RibbonAwareSection>
  )
}
