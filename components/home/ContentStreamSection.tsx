'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import {
  ContentStreamSectionData,
  ContentItem,
  ContentPlatform,
} from '@/lib/sanity/types'
import { getInstagramShortcode, getYouTubeId } from '@/lib/content/parsers'

function ContentEmbed({ item }: { item: ContentItem }) {
  if (item.platform === 'instagram') {
    const shortcode = getInstagramShortcode(item.url)
    if (!shortcode) return null

    return (
      <div className="group relative h-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#222222]/90">
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '125%' }}>
          <iframe
            src={`https://www.instagram.com/reel/${shortcode}/embed/`}
            className="absolute inset-0 h-full w-full border-0"
            allowFullScreen
            loading="lazy"
            title={item.title}
          />
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <div>
            <p className="max-w-[17rem] truncate text-sm font-medium text-white/85">
              {item.title}
            </p>
            <p className="mt-0.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-white/45">
              Instagram reel
            </p>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-white/65">
            {item.year}
          </span>
        </div>
      </div>
    )
  }

  if (item.platform === 'youtube') {
    const videoId = getYouTubeId(item.url)
    if (!videoId) return null

    return (
      <div className="group relative h-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#222222]/90">
        <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            title={item.title}
          />
        </div>

        <div className="relative flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
          <div>
            <p className="max-w-[17rem] truncate text-sm font-medium text-white/85">
              {item.title}
            </p>
            <p className="mt-0.5 text-[0.65rem] font-semibold tracking-[0.14em] uppercase text-white/45">
              YouTube video
            </p>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-white/65">
            {item.year}
          </span>
        </div>
      </div>
    )
  }

  return null
}

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.44, },
  },
}

interface ContentStreamSectionProps {
  data?: ContentStreamSectionData
}

export function ContentStreamSection({ data }: ContentStreamSectionProps) {
  const heading = data?.heading ?? 'Content'
  const items = data?.items ?? []

  const hasInstagram = items.some((i) => i.platform === 'instagram')
  const hasYouTube = items.some((i) => i.platform === 'youtube')

  const defaultTab: ContentPlatform = hasInstagram ? 'instagram' : 'youtube'
  const [activeTab, setActiveTab] = useState<ContentPlatform>(defaultTab)
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const years = useMemo(() => {
    const uniqueYears = [...new Set(items.map((i) => i.year))].sort(
      (a, b) => b - a
    )
    return uniqueYears
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesPlatform = item.platform === activeTab
      const matchesYear =
        selectedYear === 'all' || item.year === selectedYear
      return matchesPlatform && matchesYear
    })
  }, [items, activeTab, selectedYear])

  if (items.length === 0) return null

  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      className="overflow-hidden"
      contentClassName="relative py-[clamp(5.8rem,10vw,8rem)] px-6 md:px-8"
    >
      <motion.div
        className="relative mx-auto max-w-[1240px]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.14 }}
        variants={sectionVariants}
      >
        <motion.div variants={itemVariants} className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="mb-3 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-white/70">
              Media vault
            </span>
            <h2 className="text-[clamp(2.2rem,4.8vw,4rem)] font-semibold leading-[1] text-foreground">
              {heading}
            </h2>
          </div>
          <p className="max-w-[30rem] text-sm leading-relaxed text-white/55 md:text-base">
            Scroll our latest reels and long-form videos. Filter by platform and year to revisit highlights from past semesters.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mb-8 flex flex-wrap items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-2.5"
        >
          <div className="inline-flex flex-wrap gap-1.5 rounded-[0.95rem] border border-white/10 bg-[#1f1f1f]/90 p-1.5">
            {hasInstagram && (
              <button
                onClick={() => setActiveTab('instagram')}
                className={`relative overflow-hidden rounded-[0.8rem] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-300 md:text-[0.75rem] ${
                  activeTab === 'instagram'
                    ? 'text-[#252525]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {activeTab === 'instagram' && (
                  <motion.span
                    layoutId="content-tab-active"
                    className="absolute inset-0 rounded-[0.8rem] bg-accent"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Reels</span>
              </button>
            )}
            {hasYouTube && (
              <button
                onClick={() => setActiveTab('youtube')}
                className={`relative overflow-hidden rounded-[0.8rem] px-4 py-2.5 text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-300 md:text-[0.75rem] ${
                  activeTab === 'youtube'
                    ? 'text-[#252525]'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {activeTab === 'youtube' && (
                  <motion.span
                    layoutId="content-tab-active"
                    className="absolute inset-0 rounded-[0.8rem] bg-accent"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">YouTube</span>
              </button>
            )}
          </div>

          {years.length > 1 && (
            <label className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/12 bg-[#1e1e1e]/85 px-3 py-2 text-[0.72rem] font-semibold tracking-[0.12em] uppercase text-white/60">
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
        </motion.div>

        {filteredItems.length > 0 ? (
          <motion.div
            variants={itemVariants}
            className={`grid gap-3 md:gap-4 ${
              activeTab === 'instagram'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._key}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
              >
                <ContentEmbed item={item} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p
            variants={itemVariants}
            className="rounded-[1.4rem] border border-dashed border-white/20 bg-white/[0.02] py-14 text-center text-white/45"
          >
            No content to display.
          </motion.p>
        )}
      </motion.div>
    </RibbonAwareSection>
  )
}
