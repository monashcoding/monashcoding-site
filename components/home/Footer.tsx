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
            <div className="flex items-center gap-3 text-3xl font-extrabold text-foreground mb-4">
              <Image src="/logo/logo.jpg" alt="MAC Logo" width={40} height={40} className="rounded-full" />
              {brandName}
            </div>
            <p className="text-white/60 leading-relaxed">{tagline}</p>
          </div>
          {columns.map((column) => (
            <div key={column._key}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">
                {column.title}
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-6 gap-y-3">
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
          {socialLinks && socialLinks.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-6">
                Socials
              </h4>
              <ul className="list-none p-0 m-0 grid grid-cols-2 gap-x-6 gap-y-3">
                {socialLinks.map((link) => {
                  const Icon = PLATFORM_ICONS[link.platform]
                  if (!Icon) return null
                  return (
                    <li key={link._key}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white/60 no-underline transition-colors duration-300 hover:text-accent"
                      >
                        <Icon size={18} />
                        {PLATFORM_LABELS[link.platform]}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="pt-8 border-t border-white/10">
          <span className="text-white/50 text-sm">
            © {new Date().getFullYear()} Monash Association of Coding. All rights reserved.
          </span>
        </div>
        </RibbonBlock>
      </div>
    </RibbonAwareSection>
  )
}
