'use client'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useState, useRef, useEffect, useCallback, useTransition } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/sanity/lib/image'
import { CommitteeMember, CommitteePageData, TeamSlug } from '@/lib/sanity/types'
import { TEAM_ORDER } from '@/lib/committee-utils'
import { fetchCommitteeMembersByFilter, fetchAlumniPaginated } from '@/app/(site)/team/actions'
import { type FilterOption } from '@/app/(site)/team/constants'
import Timeline from '@/components/team/Timeline'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'

const Dither = dynamic(() => import('@/components/Dither'), { ssr: false })

interface CommitteePageClientProps {
  pageData: CommitteePageData | null
  initialMembers: CommitteeMember[]
  availableTeams: TeamSlug[]
  hasAlumni: boolean
}

const TEAM_LABELS: Record<TeamSlug, string> = {
  management: 'Management',
  events: 'Events',
  marketing: 'Marketing',
  design: 'Design',
  'human-resources': 'Human Resources',
  sponsorship: 'Sponsorship',
  media: 'Media',
  projects: 'Projects',
  outreach: 'Outreach',
}

const TEAM_LABELS_WITH_PC: Record<string, string> = {
  ...TEAM_LABELS,
  'human-resources': 'P&C',
}

export default function CommitteePageClient({
  pageData,
  initialMembers,
  availableTeams,
  hasAlumni,
}: CommitteePageClientProps) {
  const [selectedTeam, setSelectedTeam] = useState<FilterOption>('all')
  const [displayedMembers, setDisplayedMembers] = useState<CommitteeMember[]>(initialMembers)
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [alumniPage, setAlumniPage] = useState(0)
  const [hasMoreAlumni, setHasMoreAlumni] = useState(true)
  const [alumniTotal, setAlumniTotal] = useState(0)
  const cache = useRef(new Map<FilterOption, CommitteeMember[]>([['all', initialMembers]]))
  const alumniPaginationCache = useRef<{ page: number; hasMore: boolean; total: number } | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const loadMoreCallbackRef = useRef<() => Promise<void>>(null!)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const ditherContainerRef = useRef<HTMLDivElement>(null)

  const title = pageData?.pageTitle || 'Meet the Team'

  // Ordered list of teams that have members
  const activeTeams = TEAM_ORDER.filter((team) => availableTeams.includes(team))

  const handleTabClick = useCallback((team: FilterOption) => {
    setSelectedTeam(team)

    // Check client-side cache first
    const cached = cache.current.get(team)
    if (cached) {
      setDisplayedMembers(cached)
      // Restore alumni pagination state from cache
      if (team === 'alumni' && alumniPaginationCache.current) {
        setAlumniPage(alumniPaginationCache.current.page)
        setHasMoreAlumni(alumniPaginationCache.current.hasMore)
        setAlumniTotal(alumniPaginationCache.current.total)
      }
      return
    }

    // Fetch from server via action
    startTransition(async () => {
      if (team === 'alumni') {
        const result = await fetchAlumniPaginated(0)
        cache.current.set(team, result.members)
        setDisplayedMembers(result.members)
        setHasMoreAlumni(result.hasMore)
        setAlumniTotal(result.total)
        setAlumniPage(0)
        alumniPaginationCache.current = { page: 0, hasMore: result.hasMore, total: result.total }
      } else {
        const members = await fetchCommitteeMembersByFilter(team)
        cache.current.set(team, members)
        setDisplayedMembers(members)
      }
    })
  }, [])

  const handleLoadMoreAlumni = useCallback(async () => {
    if (isLoadingMore || !hasMoreAlumni) return

    setIsLoadingMore(true)
    const nextPage = alumniPage + 1

    const result = await fetchAlumniPaginated(nextPage)
    const newMembers = [...displayedMembers, ...result.members]

    cache.current.set('alumni', newMembers)
    setDisplayedMembers(newMembers)
    setHasMoreAlumni(result.hasMore)
    setAlumniPage(nextPage)
    setAlumniTotal(result.total)
    alumniPaginationCache.current = { page: nextPage, hasMore: result.hasMore, total: result.total }
    setIsLoadingMore(false)
  }, [alumniPage, displayedMembers, hasMoreAlumni, isLoadingMore])

  // Keep ref updated for intersection observer callback
  loadMoreCallbackRef.current = handleLoadMoreAlumni

  // Callback ref for infinite scroll sentinel - fires when element mounts/unmounts
  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }

      // Don't observe if conditions aren't met
      if (!node || selectedTeam !== 'alumni' || !hasMoreAlumni || isLoadingMore) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreCallbackRef.current()
          }
        },
        { rootMargin: '400px', threshold: 0 }
      )

      observerRef.current.observe(node)
    },
    [selectedTeam, hasMoreAlumni, isLoadingMore]
  )

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  // Mouse tracking for dither effect - uses DOM manipulation to avoid React re-renders
  useEffect(() => {
    const section = sectionRef.current
    const ditherContainer = ditherContainerRef.current
    if (!section || !ditherContainer) return

    const handleMouseMove = (e: MouseEvent) => {
      // Use viewport-relative coordinates since dither is fixed positioned
      ditherContainer.style.setProperty('--mouse-x', `${e.clientX}px`)
      ditherContainer.style.setProperty('--mouse-y', `${e.clientY}px`)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener('mousemove', handleMouseMove)
    section.addEventListener('mouseenter', handleMouseEnter)
    section.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      section.removeEventListener('mousemove', handleMouseMove)
      section.removeEventListener('mouseenter', handleMouseEnter)
      section.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Clip-path update for dither effect - clips at section top
  useEffect(() => {
    const section = sectionRef.current
    const ditherContainer = ditherContainerRef.current
    if (!section || !ditherContainer) return

    const updateClipPath = () => {
      const rect = section.getBoundingClientRect()
      // Clip everything above the section's top edge
      const clipTop = Math.max(0, rect.top)
      ditherContainer.style.setProperty('--clip-top', `${clipTop}px`)
    }

    updateClipPath()
    window.addEventListener('scroll', updateClipPath, { passive: true })
    window.addEventListener('resize', updateClipPath, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateClipPath)
      window.removeEventListener('resize', updateClipPath)
    }
  }, [])

  return (
    <main className="relative min-h-screen bg-background">
      {/* Hero Section with Team Photo Background */}
      <RibbonAwareSection
        className="h-[400px]"
        backgroundClassName="bg-black"
        contentClassName="h-full"
      >
        <div className="absolute inset-0 z-0">
          <Image
            src="/MAC_FULLCOMM-2.tif"
            alt="MAC Team"
            fill
            className="object-cover"
            priority
          />
          {/* Yellow tint overlay */}
          <div className="absolute inset-0 bg-[#FFE330]/40 mix-blend-multiply" />
          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold text-white"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
          >
            {title}
          </motion.h1>
        </div>
      </RibbonAwareSection>

      {/* Timeline Section */}
      <RibbonAwareSection
        as="div"
        backgroundClassName="bg-background"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Timeline events={pageData?.timeline || []} />
        </motion.div>
      </RibbonAwareSection>

      {/* Team Filter and Grid Section */}
      <RibbonAwareSection
        className="overflow-hidden"
        backgroundClassName="bg-[#252525]"
        contentClassName="px-4 py-16"
        contentRef={sectionRef}
      >
        {/* Dither effect - fixed to viewport, clipped to section bounds */}
        <div
          ref={ditherContainerRef}
          className="fixed inset-0 pointer-events-none -z-10"
          style={{
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.3s',
            clipPath: `inset(var(--clip-top, 0px) 0 0 0)`,
            maskImage: `radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), black 0%, transparent 70%)`,
            WebkitMaskImage: `radial-gradient(circle 300px at var(--mouse-x, 0px) var(--mouse-y, 0px), black 0%, transparent 70%)`,
          }}
        >
          <Dither
            waveSpeed={0.03}
            waveFrequency={3}
            waveAmplitude={0.3}
            waveColor={[0.97, 0.89, 0.36]}
            colorNum={4}
            pixelSize={2}
            enableMouseInteraction={false}
            mouseRadius={0.4}
          />
        </div>

        {/* Filter Tabs */}
          <div className="relative mx-auto mb-12 flex justify-center">
            <div className="inline-flex flex-wrap justify-center gap-2 rounded-2xl bg-[#252525] p-3 shadow-lg">
              <button
                onClick={() => handleTabClick('all')}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedTeam === 'all'
                    ? 'bg-[#FFE330] text-black'
                    : 'bg-white/10 text-foreground hover:bg-white/20'
                }`}
              >
                All
              </button>
              {activeTeams.map((team) => (
                <button
                  key={team}
                  onClick={() => handleTabClick(team)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedTeam === team
                      ? 'bg-[#FFE330] text-black'
                      : 'bg-white/10 text-foreground hover:bg-white/20'
                  }`}
                >
                  {TEAM_LABELS_WITH_PC[team] || TEAM_LABELS[team]}
                </button>
              ))}
              {hasAlumni && (
                <button
                  onClick={() => handleTabClick('alumni')}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedTeam === 'alumni'
                      ? 'bg-[#FFE330] text-black'
                      : 'bg-white/10 text-foreground hover:bg-white/20'
                  }`}
                >
                  Alumni
                </button>
              )}
            </div>
          </div>

          {/* Committee Member Grid */}
          <div className="relative mx-auto max-w-7xl">
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div
                  key="skeleton"
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse overflow-hidden rounded-2xl border border-white/10 bg-card"
                    >
                      <div className="aspect-square bg-white/5" />
                      <div className="space-y-2 p-4">
                        <div className="h-5 w-3/4 rounded bg-white/10" />
                        <div className="h-4 w-1/2 rounded bg-white/5" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key={selectedTeam}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Use plain divs for alumni to avoid GPU-intensive animations */}
                  {selectedTeam === 'alumni' ? (
                    <div
                      className="grid gap-6"
                      style={{
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      }}
                    >
                      {displayedMembers.map((member) => (
                        <div
                          key={member._id}
                          onClick={() => setSelectedMember(member)}
                          className="group cursor-pointer overflow-hidden rounded-2xl bg-card border border-white/10 shadow-sm transition-shadow duration-200 hover:shadow-md"
                        >
                          {/* Photo */}
                          <div className="relative aspect-square overflow-hidden">
                            {member.photo?.asset ? (
                              <Image
                                src={urlFor(member.photo).width(400).height(400).url()}
                                alt={member.photo.alt || member.name}
                                fill
                                loading="lazy"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE330]/50 to-[#FFE330]/20">
                                <span className="text-4xl font-bold text-white/40">
                                  {member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Info */}
                          <div className="p-4">
                            <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                            <p className="text-sm text-[#d4a900]">{member.role}</p>
                            <p className="mt-1 text-xs text-foreground/50">
                              {TEAM_LABELS[member.team]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <LayoutGroup>
                      <motion.div
                        layout
                        className="grid gap-6"
                        style={{
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        }}
                      >
                        {displayedMembers.map((member) => (
                          <motion.div
                            key={member._id}
                            layoutId={member._id}
                            initial={false}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            onClick={() => setSelectedMember(member)}
                            className="group cursor-pointer overflow-hidden rounded-2xl bg-card border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                          >
                            {/* Photo */}
                            <div className="relative aspect-square overflow-hidden">
                              {member.photo?.asset ? (
                                <Image
                                  src={urlFor(member.photo).width(400).height(400).url()}
                                  alt={member.photo.alt || member.name}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE330]/50 to-[#FFE330]/20">
                                  <span className="text-4xl font-bold text-white/40">
                                    {member.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .join('')}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Info */}
                            <div className="p-4">
                              <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                              <p className="text-sm text-[#d4a900]">{member.role}</p>
                              <p className="mt-1 text-xs text-foreground/50">
                                {TEAM_LABELS[member.team]}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </LayoutGroup>
                  )}

                  {/* Infinite scroll sentinel and status for alumni */}
                  {selectedTeam === 'alumni' && displayedMembers.length > 0 && (
                    <div className="mt-8 flex flex-col items-center gap-2">
                      {hasMoreAlumni && (
                        <>
                          <div ref={loadMoreSentinelRef} className="h-4" />
                          <button
                            onClick={handleLoadMoreAlumni}
                            disabled={isLoadingMore}
                            className="flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-sm text-foreground transition-colors hover:bg-white/20 disabled:opacity-50"
                          >
                            {isLoadingMore && (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FFE330] border-t-transparent" />
                            )}
                            {isLoadingMore ? 'Loading...' : 'Load More'}
                          </button>
                        </>
                      )}
                      <p className="text-sm text-foreground/50">
                        Showing {displayedMembers.length} of {alumniTotal} alumni
                      </p>
                    </div>
                  )}

                  {displayedMembers.length === 0 && (
                    <div className="py-16 text-center text-foreground/50">
                      No committee members found for this team yet.
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </RibbonAwareSection>

      {/* Member Popup */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-t-3xl bg-card p-8 shadow-2xl sm:rounded-3xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-white/10"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Photo */}
                <div className="mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-[#FFE330]/30">
                  {selectedMember.photo?.asset ? (
                    <Image
                      src={urlFor(selectedMember.photo).width(256).height(256).url()}
                      alt={selectedMember.photo.alt || selectedMember.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FFE330]/50 to-[#FFE330]/20">
                      <span className="text-4xl font-bold text-white/40">
                        {selectedMember.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h2 className="mb-1 text-2xl font-bold text-foreground">{selectedMember.name}</h2>
                <p className="mb-1 text-lg text-[#d4a900]">{selectedMember.role}</p>
                <p className="mb-4 text-sm text-foreground/50">{TEAM_LABELS[selectedMember.team]}</p>

                {selectedMember.bio && (
                  <p className="mb-6 text-sm leading-relaxed text-foreground/70">{selectedMember.bio}</p>
                )}

                {/* Additional Details */}
                {(selectedMember.pastRoles?.length || selectedMember.mbti || selectedMember.birthday || selectedMember.firstDay || selectedMember.discordHandle) && (
                  <div className="mb-6 w-full space-y-2 text-left text-sm">
                    {selectedMember.pastRoles && selectedMember.pastRoles.length > 0 && (
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-foreground/40">Past Roles:</span>
                        <span className="text-foreground/70">{selectedMember.pastRoles.join(', ')}</span>
                      </div>
                    )}
                    {selectedMember.mbti && (
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/40">MBTI:</span>
                        <span className="text-foreground/70">{selectedMember.mbti}</span>
                      </div>
                    )}
                    {selectedMember.birthday && (
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/40">Birthday:</span>
                        <span className="text-foreground/70">{selectedMember.birthday}</span>
                      </div>
                    )}
                    {selectedMember.firstDay && (
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/40">First Day:</span>
                        <span className="text-foreground/70">{selectedMember.firstDay}</span>
                      </div>
                    )}
                    {selectedMember.discordHandle && (
                      <div className="flex items-center gap-2">
                        <span className="text-foreground/40">Discord:</span>
                        <span className="text-foreground/70">{selectedMember.discordHandle}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Social Links */}
                <div className="flex flex-wrap justify-center gap-3">
                  {selectedMember.linkedIn && (
                    <a
                      href={selectedMember.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-[#0077b5] hover:text-white"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-[#FFE330] hover:text-black"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </a>
                  )}
                  {selectedMember.bentoMe && (
                    <a
                      href={selectedMember.bentoMe}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-foreground transition-colors hover:bg-[#FFE330] hover:text-black"
                      title="Bento.me"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
