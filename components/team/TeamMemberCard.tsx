'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { TeamMember } from '@/lib/sanity/types'
import { urlFor } from '@/sanity/lib/image'

interface TeamMemberCardProps {
  member: TeamMember
  onClick: () => void
  index: number
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function TeamMemberCard({
  member,
  onClick,
  index,
}: TeamMemberCardProps) {
  const imageUrl = member.photo?.asset
    ? urlFor(member.photo).width(400).height(400).fit('crop').url()
    : null

  return (
    <motion.button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-white/10 bg-card/60 p-1 text-left shadow-sm backdrop-blur-sm transition-all hover:border-accent/30 hover:shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Photo Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gradient-to-br from-white/10 to-white/5">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={member.photo?.alt || member.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/10">
            <span className="text-3xl font-bold text-accent">
              {getInitials(member.name)}
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="text-sm font-medium text-white">View Profile</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="truncate text-base font-semibold text-foreground">
          {member.name}
        </h3>
        <p className="truncate text-sm text-accent">{member.role}</p>
      </div>
    </motion.button>
  )
}
