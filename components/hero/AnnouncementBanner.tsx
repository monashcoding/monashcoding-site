'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { useEffect, useState, useCallback } from 'react'
import { Announcement } from '@/lib/sanity/types'
import Squares from '@/components/ui/Squares'

const STORAGE_KEY = 'mac-announcement-dismissed'

const announcementComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    link: ({ children, value }) => {
      const href = value?.href || '#'
      const openInNewTab = value?.openInNewTab !== false
      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
          className="underline underline-offset-2 hover:text-[#FFE330] transition-colors"
        >
          {children}
        </a>
      )
    },
  },
  block: {
    normal: ({ children }) => <span>{children}</span>,
  },
}

interface AnnouncementBannerProps {
  announcements: Announcement[]
  cycleDuration?: number
}

export function AnnouncementBanner({ announcements, cycleDuration = 5 }: AnnouncementBannerProps) {
  const [isDismissed, setIsDismissed] = useState(true) // Start hidden to prevent flash
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Check dismissal state on client mount
  useEffect(() => {
    setIsClient(true)
    const dismissed = sessionStorage.getItem(STORAGE_KEY) === 'true'
    setIsDismissed(dismissed)
  }, [])

  // Cycle through announcements
  useEffect(() => {
    if (isDismissed || !announcements.length || announcements.length === 1) return

    const durationMs = cycleDuration * 1000
    const intervalMs = 50 // Update progress every 50ms
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += intervalMs
      setProgress((elapsed / durationMs) * 100)

      if (elapsed >= durationMs) {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
        elapsed = 0
        setProgress(0)
      }
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isDismissed, announcements.length, cycleDuration, currentIndex])

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0)
  }, [currentIndex])

  const handleDismiss = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, 'true')
    setIsDismissed(true)
  }, [])

  const handleDotClick = useCallback((index: number) => {
    setCurrentIndex(index)
    setProgress(0)
  }, [])

  // Don't render on server or if dismissed
  if (!isClient || isDismissed || !announcements.length) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]
  const hasMultiple = announcements.length > 1

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 260,
            damping: 20,
            delay: 0.5,
          }
        }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-[10%] left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#151515] shadow-2xl shadow-black/50">
          {/* Animated Squares Background */}
          <div className="absolute inset-0 opacity-60">
            <Squares
              direction="diagonal"
              speed={0.3}
              squareSize={25}
              borderColor="rgba(255, 227, 48, 0.12)"
              hoverFillColor="rgba(255, 227, 48, 0.08)"
            />
          </div>

          {/* Gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#151515]/80 via-transparent to-[#151515]/80" />

          <div className="relative px-5 py-4 flex items-center justify-center">
            {/* Message container */}
            <div className="flex-1 flex items-center justify-center text-center text-sm md:text-base text-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-3"
                >
                  <PortableText
                    value={currentAnnouncement.message}
                    components={announcementComponents}
                  />

                  {/* Dot indicators for multiple announcements */}
                  {hasMultiple && (
                    <div className="flex items-center gap-1.5 ml-3">
                      {announcements.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => handleDotClick(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            index === currentIndex
                              ? 'bg-[#FFE330] scale-125'
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                          aria-label={`Go to announcement ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Dismiss announcements"
            >
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          {hasMultiple && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
              <motion.div
                className="h-full bg-[#FFE330]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05, ease: 'linear' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
