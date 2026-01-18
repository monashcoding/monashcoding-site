'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { urlFor } from '@/sanity/lib/image'
import { TeamMember, TeamPageData, TeamSlug } from '@/lib/sanity/types'
import Timeline from '@/components/team/Timeline'

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

  return (
    <main className="relative min-h-screen bg-black">
      {/* Hero Section with Dither Background - exactly 400px */}
      <section className="relative h-[400px]">
        <div className="absolute inset-0">
          <Dither
            waveSpeed={0.03}
            waveFrequency={3}
            waveAmplitude={0.3}
            waveColor={[0.97, 0.89, 0.36]}
            colorNum={4}
            pixelSize={2}
            enableMouseInteraction={true}
            mouseRadius={0.4}
          />
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
      </section>

      {/* Timeline Section - positioned immediately below dither */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Timeline events={pageData?.timeline || []} />
      </motion.section>

      {/* Team Filter and Grid Section */}
      <section className="bg-neutral-950 px-4 py-16">
        {/* Filter Tabs */}
        <div className="mx-auto mb-12 max-w-7xl">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTeam('all')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                selectedTeam === 'all'
                  ? 'bg-[#f8e45c] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
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
                    ? 'bg-[#f8e45c] text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {TEAM_LABELS[team]}
              </button>
            ))}
          </div>
        </div>

        {/* Team Member Grid */}
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid gap-6"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            }}
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  onClick={() => setSelectedMember(member)}
                  className="group cursor-pointer overflow-hidden rounded-2xl bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
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
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f8e45c]/30 to-[#f8e45c]/10">
                        <span className="text-4xl font-bold text-white/60">
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
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-sm text-[#f8e45c]">{member.role}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {TEAM_LABELS[member.team]}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredMembers.length === 0 && (
            <div className="py-16 text-center text-white/50">
              No team members found for this team yet.
            </div>
          )}
        </div>
      </section>

      {/* Member Popup */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              className="w-full max-w-lg rounded-t-3xl bg-neutral-900 p-8 sm:rounded-3xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex flex-col items-center text-center">
                {/* Photo */}
                <div className="mb-6 h-32 w-32 overflow-hidden rounded-full">
                  {selectedMember.photo?.asset ? (
                    <Image
                      src={urlFor(selectedMember.photo).width(256).height(256).url()}
                      alt={selectedMember.photo.alt || selectedMember.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#f8e45c]/30 to-[#f8e45c]/10">
                      <span className="text-4xl font-bold text-white/60">
                        {selectedMember.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <h2 className="mb-1 text-2xl font-bold text-white">{selectedMember.name}</h2>
                <p className="mb-1 text-lg text-[#f8e45c]">{selectedMember.role}</p>
                <p className="mb-4 text-sm text-white/50">{TEAM_LABELS[selectedMember.team]}</p>

                {selectedMember.bio && (
                  <p className="mb-6 text-sm leading-relaxed text-white/70">{selectedMember.bio}</p>
                )}

                {/* Social Links */}
                <div className="flex gap-4">
                  {selectedMember.linkedIn && (
                    <a
                      href={selectedMember.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#0077b5]"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {selectedMember.email && (
                    <a
                      href={`mailto:${selectedMember.email}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#f8e45c] hover:text-black"
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
