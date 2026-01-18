'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TeamMember, TeamSlug } from '@/lib/sanity/types'
import TeamMemberCard from './TeamMemberCard'
import TeamMemberPopup from './TeamMemberPopup'

interface TeamGridProps {
  members: TeamMember[]
}

type FilterOption = 'all' | TeamSlug

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'management', label: 'Management' },
  { value: 'events', label: 'Events' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'human-resources', label: 'Human Resources' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'media', label: 'Media' },
  { value: 'projects', label: 'Projects' },
  { value: 'outreach', label: 'Outreach' },
]

export default function TeamGrid({ members }: TeamGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  const filteredMembers = useMemo(() => {
    if (activeFilter === 'all') return members
    return members.filter((member) => member.team === activeFilter)
  }, [members, activeFilter])

  const availableFilters = useMemo(() => {
    const teamsWithMembers = new Set(members.map((m) => m.team))
    return FILTER_OPTIONS.filter(
      (option) => option.value === 'all' || teamsWithMembers.has(option.value as TeamSlug)
    )
  }, [members])

  return (
    <>
      {/* Filter Tabs */}
      <div className="mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-2">
          {availableFilters.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeFilter === option.value
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-white/60 text-black/60 hover:bg-white hover:text-black'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <TeamMemberCard
                key={member._id}
                member={member}
                onClick={() => setSelectedMember(member)}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="col-span-full py-12 text-center text-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No team members found
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Popup */}
      <TeamMemberPopup
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  )
}
