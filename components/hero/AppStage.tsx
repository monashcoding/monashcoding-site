'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, type ReactNode } from 'react'

const EASE_OVERLAY: [number, number, number, number] = [0.76, 0, 0.24, 1]

export interface StageItem {
  id: string
  name: string
  href: string
  external: boolean
  image: string
  imageClass: string
  unoptimized?: boolean
  icon: ReactNode
  label: (front: boolean) => ReactNode
}

type Pose = { x: number; y: number; scale: number; opacity: number; zIndex: number }

function useCompact() {
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)')
    setCompact(query.matches)
    const onChange = (event: MediaQueryListEvent) => setCompact(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return compact
}

function poseFor(offset: number, count: number, reduced: boolean, step: number): Pose {
  if (reduced) {
    return offset === 0
      ? { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 3 }
      : { x: 0, y: 0, scale: 1, opacity: 0, zIndex: 0 }
  }
  if (offset === 0) return { x: 0, y: 0, scale: 1, opacity: 1, zIndex: 3 }
  if (count > 3 && offset === count - 1) return { x: -step * 1.2, y: step * 1.35, scale: 0.97, opacity: 0, zIndex: 4 }
  if (offset === 1) return { x: step, y: -step, scale: 0.94, opacity: 1, zIndex: 2 }
  if (offset === 2) return { x: step * 2, y: -step * 2, scale: 0.88, opacity: 1, zIndex: 1 }
  return { x: step * 3, y: -step * 3, scale: 0.82, opacity: 0, zIndex: 0 }
}

interface AppStageProps {
  items: StageItem[]
  activeIndex: number
  reduced: boolean
  userPaused: boolean
  progressPaused: boolean
  cycle: number
  dwellSeconds: number
  onAdvance: () => void
  onSelect: (index: number) => void
  onTogglePause: () => void
}

export function AppStage({
  items,
  activeIndex,
  reduced,
  userPaused,
  progressPaused,
  cycle,
  dwellSeconds,
  onAdvance,
  onSelect,
  onTogglePause,
}: AppStageProps) {
  const compact = useCompact()
  const step = compact ? 14 : 28
  const mountedRef = useRef(false)
  useEffect(() => {
    mountedRef.current = true
  }, [])

  return (
    <div className="relative w-full pr-[28px] pt-[28px] sm:pr-[56px] sm:pt-[56px]">
      <div className="relative aspect-[16/11] w-full lg:aspect-[16/11.5] xl:aspect-[16/10.5]">
        <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const offset = (index - activeIndex + items.length) % items.length
          if (offset > 3 && offset !== items.length - 1) return null
          const pose = poseFor(offset, items.length, reduced, step)
          const entering = poseFor(3, items.length + 4, reduced, step)
          const isFront = offset === 0
          const isPeeking = !reduced && (offset === 1 || offset === 2)
          const linkProps = item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
          return (
            <motion.div
              key={item.id}
              id={isFront ? 'hero-app-stage' : undefined}
              aria-label={isFront ? item.name : undefined}
              aria-hidden={!isFront}
              initial={
                mountedRef.current
                  ? { x: entering.x, y: entering.y, scale: entering.scale, opacity: 0 }
                  : false
              }
              animate={{ x: pose.x, y: pose.y, scale: pose.scale, opacity: pose.opacity }}
              exit={{ opacity: 0, y: step * 1.6, transition: { duration: 0.4, ease: EASE_OVERLAY } }}
              whileHover={isPeeking ? { x: pose.x + 4, y: pose.y - 6 } : undefined}
              transition={{ duration: reduced ? 0.3 : 0.75, ease: EASE_OVERLAY }}
              style={{ zIndex: pose.zIndex, transformOrigin: '100% 0%' }}
              onClick={isPeeking ? () => onSelect(index) : undefined}
              title={isPeeking ? `Show ${item.name}` : undefined}
              className={`group absolute inset-0 flex flex-col overflow-hidden rounded-xl border transition-colors duration-300 ${
                isFront
                  ? 'border-white/20 bg-[#1E1E1E]'
                  : offset === 1
                    ? 'border-white/15 bg-[#1D1D1D]'
                    : 'border-white/10 bg-[#1A1A1A]'
              } ${isPeeking ? 'cursor-pointer hover:border-accent/70' : ''} ${isFront || isPeeking ? '' : 'pointer-events-none'}`}
            >
              <div className="flex h-11 shrink-0 items-center gap-2.5 border-b border-white/10 bg-[#161616] px-4">
                <span className={`shrink-0 ${isFront ? '' : 'opacity-80 transition-opacity group-hover:opacity-100'}`}>
                  {item.icon}
                </span>
                {item.label(isFront)}
                {isFront && (
                  <span className="ml-auto flex shrink-0 items-center gap-1">
                    {!reduced && (
                      <button
                        type="button"
                        onClick={onTogglePause}
                        className="grid size-7 place-items-center rounded-md text-white/55 transition-colors hover:bg-white/[0.08] hover:text-white"
                        aria-label={userPaused ? 'Resume carousel' : 'Pause carousel'}
                      >
                        {userPaused ? <Play size={13} /> : <Pause size={13} />}
                      </button>
                    )}
                    <a
                      href={item.href}
                      {...linkProps}
                      tabIndex={-1}
                      className="grid size-7 place-items-center rounded-md text-white/55 transition-colors hover:bg-white/[0.08] hover:text-accent"
                      aria-label={`Open ${item.name}`}
                    >
                      <ArrowUpRight size={15} />
                    </a>
                  </span>
                )}
              </div>
              <a
                href={item.href}
                {...linkProps}
                tabIndex={-1}
                aria-hidden
                className={`relative block min-h-0 flex-1 overflow-hidden ${isFront ? 'cursor-pointer' : 'pointer-events-none'}`}
              >
                <Image
                  src={item.image}
                  alt={isFront ? item.name : ''}
                  fill
                  loading="lazy"
                  unoptimized={item.unoptimized}
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={item.imageClass}
                />
                {!isFront && <span className="absolute inset-0 bg-[#141414]/55" />}
                {isFront && !reduced && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-black/25">
                    <span
                      key={cycle}
                      className="hero-rail-progress absolute inset-0 origin-left bg-accent"
                      style={{
                        animationDuration: `${dwellSeconds}s`,
                        animationPlayState: progressPaused ? 'paused' : 'running',
                      }}
                      onAnimationEnd={onAdvance}
                    />
                  </span>
                )}
              </a>
            </motion.div>
          )
        })}
        </AnimatePresence>
      </div>
    </div>
  )
}
