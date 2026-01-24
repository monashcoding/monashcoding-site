'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { StorySectionData, StoryItem as StoryItemType } from '@/lib/sanity/types'

const defaultStoryItems: StoryItemType[] = [
  {
    _key: '1',
    year: '2019',
    title: 'The Beginning',
    content:
      'MAC was founded by a group of passionate students who wanted to create a space where coding enthusiasts could learn, collaborate, and grow together.',
  },
  {
    _key: '2',
    year: '2020',
    title: 'Going Virtual',
    content:
      'Despite the global challenges, MAC adapted and thrived. We moved our workshops and events online, reaching more students than ever before.',
  },
  {
    _key: '3',
    year: '2021',
    title: 'Expanding Horizons',
    content:
      'We launched our first hackathon, bringing together over 200 participants from across Australia. Our community grew to over 1,000 members.',
  },
  {
    _key: '4',
    year: '2022',
    title: 'Industry Partnerships',
    content:
      'Major tech companies began partnering with MAC, offering exclusive workshops, internship opportunities, and mentorship programs for our members.',
  },
  {
    _key: '5',
    year: '2023',
    title: 'National Recognition',
    content:
      'MAC was recognized as one of the top student tech communities in Australia, with alumni working at leading tech companies worldwide.',
  },
  {
    _key: '6',
    year: '2024',
    title: 'The Future',
    content:
      'We continue to innovate and grow, with new initiatives in AI/ML, open source contributions, and career development programs.',
  },
]

function StoryItem({ item }: { item: StoryItemType }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1])
  const x = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, 0])

  return (
    <motion.div
      ref={ref}
      className="flex gap-12 mb-16 relative md:flex-col md:gap-4"
      style={{ opacity, x }}
    >
      <div className="text-2xl font-semibold text-accent min-w-[120px] sticky top-24 h-fit md:static">
        {item.year}
      </div>
      <div className="flex-1 pb-8 border-l border-white/10 pl-8 md:border-l-0 md:pl-0 md:border-t md:pt-4">
        <h3 className="text-2xl font-semibold text-foreground mb-4">{item.title}</h3>
        <p className="text-lg text-white/60 leading-relaxed">{item.content}</p>
      </div>
    </motion.div>
  )
}

interface StorySectionProps {
  data?: StorySectionData
}

export function StorySection({ data }: StorySectionProps) {
  const heading = data?.heading ?? 'Our Story'
  const items = data?.items ?? defaultStoryItems

  return (
    <RibbonAwareSection
      backgroundClassName="bg-secondary"
      contentClassName="min-h-screen py-32 px-8"
    >
      <div className="max-w-[1200px] mx-auto">
        <motion.h2
          className="text-[clamp(2.5rem,5vw,4rem)] font-bold mb-16 text-foreground"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {heading}
        </motion.h2>
        <div>
          {items.map((item) => (
            <StoryItem key={item._key} item={item} />
          ))}
        </div>
      </div>
    </RibbonAwareSection>
  )
}
