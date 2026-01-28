'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CommitteeMember, TeamSlug } from '@/lib/sanity/types'
import CommitteeMemberCard from './CommitteeMemberCard'
import CommitteeMemberPopup from './CommitteeMemberPopup'

interface CommitteeGridProps {
  members: CommitteeMember[]
}

type FilterOption = 'all' | 'alumni' | TeamSlug

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'management', label: 'Management' },
  { value: 'events', label: 'Events' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'human-resources', label: 'P&C' },
  { value: 'sponsorship', label: 'Sponsorship' },
  { value: 'media', label: 'Media' },
  { value: 'projects', label: 'Projects' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'alumni', label: 'Alumni' },
]

export default function CommitteeGrid({ members }: CommitteeGridProps) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [selectedMember, setSelectedMember] = useState<CommitteeMember | null>(null)

  const isAlumniMember = (m: CommitteeMember) => m.isAlumni || m.role?.toLowerCase().includes('alumni')

  const filteredMembers = useMemo(() => {
    if (activeFilter === 'all') return members.filter((m) => !isAlumniMember(m))
    if (activeFilter === 'alumni') return members.filter((m) => isAlumniMember(m))
    return members.filter((member) => member.team === activeFilter && !isAlumniMember(member))
  }, [members, activeFilter])

  const availableFilters = useMemo(() => {
    const activeMembers = members.filter((m) => !isAlumniMember(m))
    const hasAlumni = members.some((m) => isAlumniMember(m))
    const teamsWithMembers = new Set(activeMembers.map((m) => m.team))
    return FILTER_OPTIONS.filter(
      (option) =>
        option.value === 'all' ||
        (option.value === 'alumni' && hasAlumni) ||
        teamsWithMembers.has(option.value as TeamSlug)
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
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-card/60 text-white/60 hover:bg-white/20 hover:text-white'
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
              <CommitteeMemberCard
                key={member._id}
                member={member}
                onClick={() => setSelectedMember(member)}
                index={index}
              />
            ))
          ) : (
            <motion.div
              className="col-span-full py-12 text-center text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No committee members found
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Popup */}
      <CommitteeMemberPopup
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  )
}
