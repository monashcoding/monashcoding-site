'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { SponsorsSectionData, Sponsor } from '@/lib/sanity/types'

const defaultSponsors: Sponsor[] = [
  { _key: '1', name: 'Google', x: 15, y: 20 },
  { _key: '2', name: 'Microsoft', x: 70, y: 15 },
  { _key: '3', name: 'AWS', x: 40, y: 60 },
  { _key: '4', name: 'Atlassian', x: 20, y: 70 },
  { _key: '5', name: 'Canva', x: 75, y: 65 },
  { _key: '6', name: 'Optiver', x: 50, y: 30 },
]

function SponsorBubble({
  name,
  initialX,
  initialY,
}: {
  name: string
  initialX: number
  initialY: number
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.div
      className="absolute px-8 py-4 bg-accent/10 border border-accent/30 rounded-full text-accent font-medium cursor-grab select-none transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(180,83,9,0.2)] active:cursor-grabbing"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      drag
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false)
        const container = document.querySelector('[data-sponsors-area]')
        if (container) {
          const rect = container.getBoundingClientRect()
          const newX = ((info.point.x - rect.left) / rect.width) * 100
          const newY = ((info.point.y - rect.top) / rect.height) * 100
          setPosition({
            x: Math.max(10, Math.min(90, newX)),
            y: Math.max(10, Math.min(90, newY)),
          })
        }
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: isDragging
          ? '0 0 40px rgba(255, 215, 0, 0.4)'
          : '0 0 20px rgba(255, 215, 0, 0.1)',
      }}
    >
      {name}
    </motion.div>
  )
}

interface SponsorsSectionProps {
  data?: SponsorsSectionData
}

export function SponsorsSection({ data }: SponsorsSectionProps) {
  const heading = data?.heading ?? 'Our Sponsors'
  const description = data?.description ?? 'Drag and interact with our amazing partners'
  const sponsors = data?.sponsors ?? defaultSponsors

  return (
    <RibbonAwareSection
      backgroundClassName="bg-secondary"
      className="overflow-hidden"
      contentClassName="min-h-[80vh] py-24 px-8"
    >
      <div className="max-w-[1200px] mx-auto text-center">
        <motion.h2
          className="text-[clamp(2rem,4vw,3rem)] font-bold text-foreground"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {heading}
        </motion.h2>
        <motion.p
          className="text-white/60 mt-4 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {description}
        </motion.p>
        <motion.div
          data-sponsors-area
          className="relative min-h-[400px] border border-dashed border-white/15 rounded-[2rem] mt-12 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {sponsors.map((sponsor) => (
            <SponsorBubble
              key={sponsor._key}
              name={sponsor.name}
              initialX={sponsor.x}
              initialY={sponsor.y}
            />
          ))}
        </motion.div>
      </div>
    </RibbonAwareSection>
  )
}
