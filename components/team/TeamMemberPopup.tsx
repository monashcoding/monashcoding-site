'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Linkedin, Mail } from 'lucide-react'
import { TeamMember, TeamSlug } from '@/lib/sanity/types'
import { urlFor } from '@/sanity/lib/image'

interface TeamMemberPopupProps {
  member: TeamMember | null
  onClose: () => void
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TeamMemberPopup({
  member,
  onClose,
}: TeamMemberPopupProps) {
  useEffect(() => {
    if (member) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [member])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const imageUrl = member?.photo?.asset
    ? urlFor(member.photo).width(600).height(600).fit('crop').url()
    : null

  return (
    <AnimatePresence>
      {member && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            className="fixed inset-x-4 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl border border-white/10 bg-card shadow-xl md:inset-x-auto md:bottom-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white/50 transition-colors hover:bg-white/20 hover:text-white/80"
              aria-label="Close popup"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Content */}
            <div className="p-6">
              {/* Photo */}
              <div className="relative mx-auto mb-6 aspect-square w-48 overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={member.photo?.alt || member.name}
                    fill
                    className="object-cover"
                    sizes="192px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
                    <span className="text-5xl font-bold text-amber-600/60">
                      {getInitials(member.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-center">
                <h2 className="mb-1 text-2xl font-bold text-foreground">
                  {member.name}
                </h2>
                <p className="mb-2 text-lg text-amber-600">{member.role}</p>
                <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-sm text-white/60">
                  {TEAM_LABELS[member.team] || member.team}
                </span>

                {/* Bio */}
                {member.bio && (
                  <p className="mt-6 text-left text-white/70">{member.bio}</p>
                )}

                {/* Social Links */}
                {(member.linkedIn || member.email) && (
                  <div className="mt-6 flex justify-center gap-4">
                    {member.linkedIn && (
                      <a
                        href={member.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-[#0077b5] hover:text-white"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-amber-500 hover:text-white"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
