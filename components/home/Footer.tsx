'use client'

import { RibbonAwareSection } from '@/components/RibbonAwareSection'
import { FooterSectionData, FooterColumn, FooterLink } from '@/lib/sanity/types'

const defaultColumns: FooterColumn[] = [
  {
    _key: 'nav',
    title: 'Navigation',
    links: [
      { _key: '1', label: 'Home', url: '/', isExternal: false },
      { _key: '2', label: 'Meet the Team', url: '/team', isExternal: false },
      { _key: '3', label: 'Recruitment', url: '/recruitment', isExternal: false },
      { _key: '4', label: 'Sponsor Us', url: '/sponsor', isExternal: false },
      { _key: '5', label: 'Contact', url: '/contact', isExternal: false },
    ],
  },
  {
    _key: 'connect',
    title: 'Connect',
    links: [
      { _key: '1', label: 'Instagram', url: 'https://instagram.com/monashcoding', isExternal: true },
      { _key: '2', label: 'LinkedIn', url: 'https://linkedin.com/company/monashcoding', isExternal: true },
      { _key: '3', label: 'Discord', url: '#', isExternal: true },
      { _key: '4', label: 'Email', url: 'mailto:hello@monashcoding.com', isExternal: false },
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
}

export function Footer({ data }: FooterProps) {
  const brandName = data?.brandName ?? 'MAC'
  const tagline = data?.tagline ?? 'Monash Association of Coding - Empowering students through code since 2019.'
  const columns = data?.columns ?? defaultColumns
  const instagramUrl = data?.instagramUrl ?? 'https://instagram.com/monashcoding'
  const linkedinUrl = data?.linkedinUrl ?? 'https://linkedin.com/company/monashcoding'

  return (
    <RibbonAwareSection
      as="footer"
      backgroundClassName="bg-secondary border-t border-white/10"
      contentClassName="py-24 px-8 pb-12"
    >
      <div className="max-w-[1200px] mx-auto">
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
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-white/50 transition-colors duration-300 hover:text-accent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/50 transition-colors duration-300 hover:text-accent"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </RibbonAwareSection>
  )
}
