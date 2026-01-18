'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { HeroData } from '@/lib/sanity/types'
import { HeroDescription } from '@/lib/sanity/portableText'
import { urlFor } from '@/sanity/lib/image'
import CircularText from '@/components/CircularText'

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

  const { titleLines, description, heroImage, scrollIndicatorText } = heroData

  // Build image URL from Sanity or use fallback
  const imageUrl = heroImage?.asset?.url
    ? heroImage.asset.url.startsWith('/')
      ? heroImage.asset.url // Local fallback image
      : urlFor(heroImage).width(1200).height(1600).fit('crop').url()
    : '/hero-image.jpg'

  const hasDescription = description && description.length > 0

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex overflow-hidden"
    >
      {/* Left Side: Image with Logo overlay */}
      <div className="relative w-full h-screen lg:w-1/2">
        {/* Hero Image - Full height */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <img
            src={imageUrl}
            alt={heroImage?.alt || 'MAC community'}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay for better contrast */}
          <div className="absolute inset-0 bg-linear-to-r from-black/20 to-black/40" />
        </motion.div>

        {/* Centered Logo with Spinning Text */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            {/* Spinning Circular Text */}
            <div className="absolute w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <CircularText
                text="MONASH*ASSOCIATION*OF*CODING*"
                spinDuration={20}
                onHover="speedUp"
                fontSize="24px"
                className="w-full! h-full! text-white! drop-shadow-lg"
              />
            </div>
            {/* 3D Logo */}
            <MacLogo3D className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="hidden lg:flex items-center justify-center w-1/2 h-screen bg-[radial-gradient(ellipse_at_top_left,#ffffff_0%,#deddda_50%)] relative">
        {/* Ribbons Mouse Trail Effect */}
        <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
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

        {/* Content */}
        <div className="relative z-30 flex flex-col justify-center px-8 max-w-xl xl:max-w-2xl pointer-events-none">
          {/* Title */}
          <h1 className="text-[clamp(3rem,5vw,5rem)] font-extrabold tracking-tight leading-[1.1] text-foreground">
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

          {/* Description */}
          <motion.div
            className="text-base text-black/70 leading-relaxed mt-8 max-w-lg xl:text-lg xl:max-w-xl"
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
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black/50 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <span className="text-xs tracking-[0.2em] uppercase">
            {scrollIndicatorText || 'Scroll'}
          </span>
          <motion.div
            className="w-px h-15 bg-linear-to-b from-black/50 to-transparent"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Mobile Layout - Stacked */}
      <div className="lg:hidden absolute inset-0 flex flex-col">
        {/* Mobile content overlay on image */}
        <div className="absolute bottom-0 left-0 right-0 z-30 p-6 bg-linear-to-t from-black/80 via-black/50 to-transparent">
          {/* Title */}
          <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold tracking-tight leading-[1.1] text-white">
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

          {/* Description */}
          <motion.div
            className="text-sm text-white/80 leading-relaxed mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {hasDescription ? (
              <HeroDescription value={description} />
            ) : (
              <FallbackDescription className="text-white/80" />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
