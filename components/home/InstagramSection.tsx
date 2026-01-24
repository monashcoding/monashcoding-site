'use client'

import { motion } from 'framer-motion'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { InstagramSectionData } from '@/lib/sanity/types'

interface InstagramSectionProps {
  data?: InstagramSectionData
}

export function InstagramSection({ data }: InstagramSectionProps) {
  const heading = data?.heading ?? 'Follow Our Journey'
  const handle = data?.handle ?? '@monashcoding'
  const url = data?.url ?? 'https://instagram.com/monashcoding'
  const postCount = data?.postCount ?? 6

  return (
    <RibbonAwareSection
      backgroundClassName="bg-background"
      contentClassName="py-24 px-8"
    >
      <div className="max-w-[1200px] mx-auto mb-16 flex justify-between items-center flex-wrap gap-4">
        <motion.h2
          className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {heading}
        </motion.h2>
        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-accent font-medium no-underline transition-opacity duration-300 hover:opacity-80"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {handle}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </motion.a>
      </div>
      <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {Array.from({ length: postCount }, (_, index) => (
          <motion.div
            key={index}
            className="aspect-square rounded-2xl overflow-hidden bg-white/5 relative cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              Instagram Post {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </RibbonAwareSection>
  )
}
