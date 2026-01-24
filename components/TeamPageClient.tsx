'use client'

import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/sanity/lib/image'
import { TeamMember, TeamPageData, TeamSlug } from '@/lib/sanity/types'
import Timeline from '@/components/team/Timeline'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'

const Dither = dynamic(() => import('@/components/Dither'), { ssr: false })

interface TeamPageClientProps {
  pageData: TeamPageData | null
  members: TeamMember[]
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

const TEAM_ORDER: TeamSlug[] = [
  'management',
  'events',
  'marketing',
  'design',
  'human-resources',
  'sponsorship',
  'media',
  'projects',
  'outreach',
]

export default function TeamPageClient({ pageData, members }: TeamPageClientProps) {
  const [selectedTeam, setSelectedTeam] = useState<TeamSlug | 'all'>('all')
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const title = pageData?.pageTitle || 'Meet the Team'

  // Group members by team
  const teamGroups = useMemo(() => {
    const groups: Record<TeamSlug, TeamMember[]> = {
      management: [],
      events: [],
      marketing: [],
      design: [],
      'human-resources': [],
      sponsorship: [],
      media: [],
      projects: [],
      outreach: [],
    }

    members.forEach((member) => {
      if (member.team && groups[member.team]) {
        groups[member.team].push(member)
      }
    })

    return groups
  }, [members])

  // Filter members based on selected team
  const filteredMembers = useMemo(() => {
    if (selectedTeam === 'all') return members
    return teamGroups[selectedTeam] || []
  }, [selectedTeam, members, teamGroups])

  // Get teams that have members
  const activeTeams = TEAM_ORDER.filter((team) => teamGroups[team].length > 0)

  // Mouse tracking for dither effect
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
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
      >
        <div ref={sectionRef} className="relative">
          {/* Dither effect following cursor */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 -z-10"
            style={{
              opacity: isHovering ? 1 : 0,
              maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
              WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 70%)`,
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
                onClick={() => setSelectedTeam('all')}
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
                  onClick={() => setSelectedTeam(team)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                    selectedTeam === team
                      ? 'bg-[#FFE330] text-black'
                      : 'bg-white/10 text-foreground hover:bg-white/20'
                  }`}
                >
                  {TEAM_LABELS[team]}
                </button>
              ))}
            </div>
          </div>

          {/* Team Member Grid */}
          <div className="relative mx-auto max-w-7xl">
            <LayoutGroup>
              <motion.div
                layout
                className="grid gap-6"
                style={{
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                }}
              >
                {filteredMembers.map((member) => (
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

            {filteredMembers.length === 0 && (
              <div className="py-16 text-center text-foreground/50">
                No team members found for this team yet.
              </div>
            )}
          </div>
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

                {/* Social Links */}
                <div className="flex gap-4">
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
