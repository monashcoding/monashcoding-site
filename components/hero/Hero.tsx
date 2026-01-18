'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { HeroData } from '@/lib/sanity/types'
import { HeroDescription } from '@/lib/sanity/portableText'
import { urlFor } from '@/sanity/lib/image'

const Ribbons = dynamic(() => import('@/components/Ribbons'), { ssr: false })
const MacLogo3D = dynamic(() => import('@/components/MacLogo3D'), { ssr: false })

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
}

interface HeroProps {
  data: HeroData | null
}

// Fallback content when Sanity data is not available
const fallbackData: HeroData = {
  titleLines: ['MONASH', 'ASSOCIATION', 'OF CODING'],
  subtitle: 'Empowering students through code',
  description: [],
  heroImage: {
    asset: { _id: '', url: '/hero-image.jpg' },
    alt: 'MAC community',
  },
  scrollIndicatorText: 'Scroll',
}

// Fallback description when no Sanity description is available
function FallbackDescription({ className }: { className?: string }) {
  return (
    <p className={className}>
      At MAC, we aim to impart{' '}
      <span className="bg-yellow-300 px-1 py-0.5">
        technical skills and industry-relevant experiences
      </span>{' '}
      to students to{' '}
      <span className="bg-yellow-300 px-1 py-0.5">
        bridge the gap between the classroom
      </span>{' '}
      and industry. We want to make coding a fun experience for all—regardless of degree,
      year level, and experience—by providing{' '}
      <span className="bg-yellow-300 px-1 py-0.5">collaborative learning opportunities</span>{' '}
      for our members.
    </p>
  )
}

export function Hero({ data }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const heroData = data || fallbackData

  const { titleLines, subtitle, description, heroImage, scrollIndicatorText } = heroData

  // Build image URL from Sanity or use fallback
  const imageUrl = heroImage?.asset?.url
    ? heroImage.asset.url.startsWith('/')
      ? heroImage.asset.url // Local fallback image
      : urlFor(heroImage).width(1000).height(800).fit('crop').url()
    : '/hero-image.jpg'

  const hasDescription = description && description.length > 0

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#deddda_50%)]"
    >
      {/* Ribbons Mouse Trail Effect */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
        <Ribbons
          colors={['#FFD700']}
          baseSpring={0.03}
          baseFriction={0.9}
          baseThickness={40}
          offsetFactor={0}
          maxAge={500}
          pointCount={50}
          speedMultiplier={0.6}
          enableFade={false}
          enableShaderEffect={false}
          effectAmplitude={2}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-30 flex flex-col items-center justify-center w-full h-full max-w-full p-4 gap-4 pointer-events-none md:p-6 md:gap-6 lg:flex-row lg:p-8 lg:gap-8">
        {/* Left: Title */}
        <div className="flex flex-col items-center justify-center flex-1 order-2 lg:items-end lg:order-0">
          <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold text-center tracking-tight leading-[1.1] text-foreground whitespace-nowrap md:text-[clamp(2.5rem,5vw,5rem)] lg:text-right">
            {titleLines.map((line, lineIndex) => {
              const charOffset = titleLines.slice(0, lineIndex).join('').length
              return (
                <span key={lineIndex} className="block">
                  {line.split('').map((char, i) => (
                    <motion.span
                      key={`l${lineIndex}-${i}`}
                      custom={charOffset + i}
                      variants={letterVariants}
                      initial="hidden"
                      animate="visible"
                      className="inline-block"
                    >
                      {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                  ))}
                </span>
              )
            })}
          </h1>
          <motion.p
            className="text-[clamp(1rem,1.5vw,1.25rem)] font-normal text-center text-black/60 mt-4 lg:text-right"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Center: Logo */}
        <motion.div
          className="flex items-center justify-center shrink-0 order-1 lg:order-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <MacLogo3D className="w-56 -mx-16 h-80 md:w-[clamp(280px,45vw,380px)] md:-mx-20 md:h-[clamp(350px,60vw,520px)] lg:w-[clamp(350px,35vw,500px)] lg:-mx-28 lg:h-[clamp(420px,45vw,700px)]" />
        </motion.div>

        {/* Right: Description + Image */}
        <div className="flex flex-col justify-center items-center flex-1 gap-6 order-3 lg:items-start lg:order-0">
          <motion.div
            className="text-sm text-black/70 leading-relaxed w-full max-w-[280px] text-center relative z-30 md:max-w-[350px] lg:max-w-[500px] lg:text-left lg:text-[clamp(0.875rem,1.1vw,1.1rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {hasDescription ? (
              <HeroDescription value={description} />
            ) : (
              <FallbackDescription />
            )}
          </motion.div>
          <motion.div
            className="relative z-10 rounded-3xl overflow-hidden w-full max-w-[280px] md:max-w-[350px] lg:max-w-[500px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <img
              src={imageUrl}
              alt={heroImage?.alt || 'MAC community'}
              className="w-full h-40 object-cover rounded-3xl md:h-[clamp(180px,25vh,250px)] lg:h-[clamp(280px,40vh,400px)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 flex flex-col items-center gap-2 text-black/50 z-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase">
          {scrollIndicatorText || 'Scroll'}
        </span>
        <motion.div
          className="w-px h-[60px] bg-gradient-to-b from-black/50 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
