'use client'

import { useState } from 'react'
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

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg('Please enter a valid email address')
      return
    }

    setStatus('sending')
    setErrorMsg('')

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Newsletter Subscriber',
          emailAddress: trimmed,
          subject: 'Newsletter Subscription',
          message: `New newsletter subscription from: ${trimmed}`,
        }),
      })

      if (!response.ok) throw new Error('Failed to subscribe')

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-[0.1em] text-foreground mb-3">
        Newsletter
      </h4>
      <p className="text-white/60 text-sm mb-4">Stay up to date with our latest events and news.</p>
      {status === 'success' ? (
        <p className="text-accent text-sm font-medium">Thanks for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errorMsg) setErrorMsg('')
              if (status === 'error') setStatus('idle')
            }}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/10 text-foreground text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full px-6 py-2 rounded-full bg-accent text-background text-sm font-semibold hover:bg-accent/90 active:scale-95 transition-all disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Subscribe'}
          </button>
        </form>
      )}
      {errorMsg && <p className="text-red-400 text-sm mt-2">{errorMsg}</p>}
    </div>
  )
}

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
          <NewsletterForm />
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
