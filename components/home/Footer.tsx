'use client'

import Image from 'next/image'
import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { RibbonBlock } from '@/components/RibbonText'
import { FooterSectionData, FooterColumn, NavItem, SocialLink } from '@/lib/sanity/types'
import { PLATFORM_ICONS, PLATFORM_LABELS } from '@/lib/socialPlatforms'

const defaultColumns: FooterColumn[] = [
  {
    _key: 'nav',
    title: 'Navigation',
    links: [
      { _key: '1', label: 'Home', url: '/', isExternal: false },
      { _key: '2', label: 'Meet the Team', url: '/team', isExternal: false },
      { _key: '3', label: 'Sponsor Us', url: '/sponsor', isExternal: false },
      { _key: '4', label: 'Contact', url: '/contact', isExternal: false },
    ],
  },
  {
    _key: 'resources',
    title: 'Resources',
    links: [
      { _key: '1', label: 'Events', url: '#', isExternal: false },
      { _key: '2', label: 'Blog', url: '#', isExternal: false },
      { _key: '3', label: 'FAQs', url: '#', isExternal: false },
    ],
  },
]

interface FooterProps {
  data?: FooterSectionData
  navItems?: NavItem[]
  socialLinks?: SocialLink[]
}

export function Footer({ data, navItems, socialLinks }: FooterProps) {
  const brandName = data?.brandName ?? 'MAC'
  const tagline = data?.tagline ?? 'Monash Association of Coding - Empowering students through code since 2019.'

  // Build columns: use Sanity data if available, otherwise build from nav items + defaults
  let columns: FooterColumn[]
  if (data?.columns) {
    columns = data.columns
  } else if (navItems && navItems.length > 0) {
    columns = [
      {
        _key: 'nav',
        title: 'Navigation',
        links: navItems.map((item) => ({
          _key: item._key,
          label: item.label,
          url: item.href,
          isExternal: false,
        })),
      },
      ...defaultColumns.filter((c) => c._key !== 'nav'),
    ]
  } else {
    columns = defaultColumns
  }

  return (
    <RibbonAwareSection
      as="footer"
      backgroundClassName="bg-background border-t border-white/10"
      contentClassName="py-24 px-8 pb-12"
    >
      <div className="max-w-[1200px] mx-auto">
        <RibbonBlock darkClass="text-[#252525] [&_*]:!text-[#252525] [&_svg]:!fill-[#252525] [&_svg]:!text-[#252525]">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-12 mb-16">
          <div>
            <div className="text-3xl font-extrabold text-foreground mb-4">{brandName}</div>
            <p className="text-white/60 leading-relaxed">{tagline}</p>
          </div>
          {columns.map((column) => (
            <div key={column._key}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">
                {column.title}
              </h4>
              <ul className="list-none p-0 m-0 space-y-3">
                {column.links.map((link) => (
                  <li key={link._key}>
                    <a
                      href={link.url}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-white/60 no-underline transition-colors duration-300 hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center flex-wrap gap-4 pt-8 border-t border-white/10">
          <span className="text-white/50 text-sm">
            © {new Date().getFullYear()} Monash Association of Coding. All rights reserved.
          </span>
          <div className="flex gap-6">
            {socialLinks?.map((link) => {
              const Icon = PLATFORM_ICONS[link.platform]
              if (!Icon) return null
              return (
                <a
                  key={link._key}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={PLATFORM_LABELS[link.platform]}
                  className="text-white/50 transition-colors duration-300 hover:text-accent"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
        </div>
        </RibbonBlock>
      </div>
    </RibbonAwareSection>
  )
}
