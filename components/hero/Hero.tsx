'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { HeroData, HeroMedia, HeroImageMedia, HeroVideoMedia, SanityImage } from '@/lib/sanity/types'
import { HeroDescription } from '@/lib/sanity/portableText'
import { urlFor } from '@/sanity/lib/image'
import CircularText from '@/components/CircularText'

const MacLogo3D = dynamic(() => import('@/components/MacLogo3D'), { ssr: false })

// Text reveal animation with yellow block wipe
function TextReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="relative inline-block overflow-x-clip">
      {/* Invisible text that always takes up space for proper sizing */}
      <span className="invisible">{children}</span>

      {/* The actual visible text - positioned on top, revealed via clip-path */}
      <motion.span
        className="absolute inset-0"
        initial={{ clipPath: 'inset(-10% 100% -10% 0)' }}
        animate={{
          clipPath: [
            'inset(-10% 100% -10% 0)',  // fully hidden
            'inset(-10% 100% -10% 0)',  // still hidden while block enters
            'inset(-10% 100% -10% 0)',  // still hidden while block pauses
            'inset(-10% 0% -10% 0)',    // revealed as block exits
          ],
        }}
        transition={{
          duration: 1.3,
          delay,
          ease: 'easeInOut',
          times: [0, 0.25, 0.6, 1],
        }}
      >
        {children}
      </motion.span>

      {/* Yellow block: enters from left, pauses, exits right */}
      <motion.span
        className="absolute -inset-y-2 left-0 right-0 bg-[#FFE330]"
        initial={{ x: '-105%' }}
        animate={{
          x: ['-105%', '0%', '0%', '200%'],
        }}
        transition={{
          duration: 1.3,
          delay,
          ease: 'easeInOut',
          times: [0, 0.25, 0.6, 1],
        }}
      />
    </span>
  )
}

interface HeroProps {
  data: HeroData | null
}

// Fallback content when Sanity data is not available
const fallbackData: HeroData = {
  titleLines: ['MONASH', 'ASSOCIATION', 'OF CODING'],
  description: [],
  heroMedia: [
    {
      _key: 'fallback-1',
      _type: 'heroImage',
      image: { asset: { _id: '', url: '/hero-image.jpg' } },
      alt: 'MAC community',
    },
  ],
  overlayOpacity: 40,
  slideshowInterval: 5,
  fadeDuration: 1,
  scrollIndicatorText: 'Scroll',
}

// Helper to build image URL from Sanity image or fallback
function getImageUrl(image: SanityImage | undefined): string {
  if (!image?.asset?.url) return '/hero-image.jpg'
  if (image.asset.url.startsWith('/')) return image.asset.url
  return urlFor(image).width(1200).height(1600).fit('crop').url()
}

// Type guard to check if media is an image
function isImageMedia(media: HeroMedia): media is HeroImageMedia {
  return media._type === 'heroImage'
}

// Type guard to check if media is a video
function isVideoMedia(media: HeroMedia): media is HeroVideoMedia {
  return media._type === 'heroVideo'
}

// Fallback description when no Sanity description is available
function FallbackDescription({ className }: { className?: string }) {
  return (
    <p className={className}>
      At MAC, we aim to impart{' '}
      <span className="bg-accent px-1 py-0.5">
        technical skills and industry-relevant experiences
      </span>{' '}
      to students to{' '}
      <span className="bg-accent px-1 py-0.5">
        bridge the gap between the classroom
      </span>{' '}
      and industry. We want to make coding a fun experience for all—regardless of degree,
      year level, and experience—by providing{' '}
      <span className="bg-accent px-1 py-0.5">collaborative learning opportunities</span>{' '}
      for our members.
    </p>
  )
}

export function Hero({ data }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())
  const heroData = data || fallbackData
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const { titleLines, description, heroMedia, overlayOpacity, slideshowInterval, fadeDuration, scrollIndicatorText } = heroData

  const currentMedia = heroMedia?.[currentMediaIndex]
  const isCurrentVideo = currentMedia && isVideoMedia(currentMedia)

  // Slideshow effect - cycle through media (only for images, videos advance on end)
  useEffect(() => {
    if (!heroMedia || heroMedia.length <= 1) return
    if (isCurrentVideo && isVideoPlaying) return // Don't auto-advance during video playback

    const intervalMs = (slideshowInterval || 5) * 1000
    const timer = setInterval(() => {
      setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [heroMedia, slideshowInterval, isCurrentVideo, isVideoPlaying])

  // Handle video end - advance to next media
  const handleVideoEnd = () => {
    setIsVideoPlaying(false)
    if (heroMedia && heroMedia.length > 1) {
      setCurrentMediaIndex((prev) => (prev + 1) % heroMedia.length)
    }
  }

  // Play video when it becomes active
  useEffect(() => {
    if (currentMedia && isVideoMedia(currentMedia)) {
      const video = videoRefs.current.get(currentMedia._key)
      if (video) {
        video.currentTime = 0
        video.play().then(() => setIsVideoPlaying(true)).catch(() => {})
      }
    } else {
      setIsVideoPlaying(false)
    }
  }, [currentMediaIndex, currentMedia])

  const hasDescription = description && description.length > 0

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden"
    >
      {/* Full-width Hero Media Background */}
      <div className="absolute inset-0 z-0">
        {heroMedia?.map((media, index) => (
          <motion.div
            key={media._key || index}
            className="absolute inset-0"
            style={{ filter: 'grayscale(80%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentMediaIndex ? 1 : 0 }}
            transition={{ duration: fadeDuration || 1, ease: 'easeInOut' }}
          >
            {isImageMedia(media) ? (
              <Image
                src={getImageUrl(media.image)}
                alt={media.alt || 'MAC community'}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
            ) : isVideoMedia(media) ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(media._key, el)
                }}
                src={media.video?.asset?.url}
                poster={media.poster ? getImageUrl(media.poster) : undefined}
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={handleVideoEnd}
              />
            ) : null}
          </motion.div>
        ))}

        {/* Dark overlay with slight yellow tint */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-linear-to-b from-accent/10 via-accent/10 via-70% to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex flex-col lg:flex-row items-center justify-center">
        {/* Logo Section */}
        <div className="flex-1 flex items-center justify-center py-20 lg:py-0">
          <motion.div
            key="hero-logo"
            className="relative flex items-center justify-center"
            initial={false}
            animate={{ opacity: 1 }}
            onMouseEnter={() => setIsLogoHovered(true)}
            onMouseLeave={() => setIsLogoHovered(false)}
          >
            {/* Spinning Circular Text */}
            <div className="absolute w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <CircularText
                text="MONASH*ASSOCIATION*OF*CODING*"
                spinDuration={20}
                onHover="speedUp"
                fontSize="24px"
                className="w-full! h-full! text-white! drop-shadow-lg"
                forceHover={isLogoHovered}
              />
            </div>
            {/* 3D Logo */}
            <MacLogo3D className="w-48 h-64 md:w-64 md:h-80 lg:w-72 lg:h-96 drop-shadow-2xl pointer-events-none" />
          </motion.div>
        </div>

        {/* Text Content Section - Desktop */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8">
          <div className="max-w-xl xl:max-w-2xl">
            {/* Title */}
            <h1 className="text-[clamp(3rem,5vw,5rem)] font-extrabold tracking-tight leading-[1.1] text-white">
              {titleLines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  <TextReveal delay={lineIndex * 0.15}>{line}</TextReveal>
                </span>
              ))}
            </h1>

            {/* Description */}
            <motion.div
              className="text-base text-white/70 leading-relaxed mt-8 xl:text-lg"
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
        </div>
      </div>

      {/* Mobile Text Content */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-background via-background/90 to-transparent">
        {/* Title */}
        <h1 className="text-[clamp(2rem,8vw,3rem)] font-extrabold tracking-tight leading-[1.1] text-white">
          {titleLines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              <TextReveal delay={lineIndex * 0.15}>{line}</TextReveal>
            </span>
          ))}
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

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 z-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase">
          {scrollIndicatorText || 'Scroll'}
        </span>
        <motion.div
          className="w-px h-15 bg-gradient-to-b from-white/50 to-transparent"
          animate={prefersReducedMotion ? {} : { scaleY: [1, 0.5, 1] }}
          transition={prefersReducedMotion ? {} : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
