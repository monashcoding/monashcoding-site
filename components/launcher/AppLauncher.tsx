'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { COMMITTEE_APPS, PUBLIC_APPS, type MacApp } from '@/lib/apps'
import {
  initials,
  signInWithMac,
  signOutOfMac,
  useMacSession,
  type MacProvider,
  type MacSession,
} from '@/lib/mac-auth'
import { AppIcon } from './AppIcon'

export const OPEN_LAUNCHER_EVENT = 'mac:open-launcher'

export function openAppLauncher() {
  window.dispatchEvent(new Event(OPEN_LAUNCHER_EVENT))
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1]

function LauncherDots({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="shrink-0">
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3)
        const col = i % 3
        return (
          <motion.rect
            key={i}
            x={col * 7}
            y={row * 7}
            width={4}
            height={4}
            rx={0.75}
            fill="currentColor"
            style={{ originX: `${col * 7 + 2}px`, originY: `${row * 7 + 2}px` }}
            animate={active ? { scale: i === 4 ? 1 : [1, 0.55, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, delay: (row + col) * 0.04, ease: EASE_OUT }}
          />
        )
      })}
    </svg>
  )
}

function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.2-2.1 3.5-5.1 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  )
}

function MicrosoftMark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
      <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
      <path fill="#7FBA00" d="M12.5 1H23v10.5H12.5z" />
      <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
      <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
    </svg>
  )
}

function AccountSection({ session }: { session: MacSession }) {
  const [pending, setPending] = useState<MacProvider | null>(null)
  const [error, setError] = useState<string | null>(null)

  const start = async (provider: MacProvider) => {
    setPending(provider)
    setError(null)
    try {
      await signInWithMac(provider)
    } catch {
      setPending(null)
      setError("Couldn't reach MAC sign-in. Try again in a moment.")
    }
  }

  if (session.status === 'loading') {
    return (
      <div className="flex items-center gap-3 px-5 py-5" aria-busy="true">
        <span className="size-10 rounded-full bg-white/[0.06]" />
        <span className="flex flex-col gap-2">
          <span className="h-3 w-32 rounded-sm bg-white/[0.06]" />
          <span className="h-2.5 w-44 rounded-sm bg-white/[0.04]" />
        </span>
      </div>
    )
  }

  if (session.status === 'signed-out') {
    return (
      <div className="px-5 py-5">
        <p className="text-sm font-semibold text-white">Sign in with your MAC account</p>
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => start('google')}
            disabled={pending !== null}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-accent px-3 text-xs font-semibold text-accent-foreground transition-colors hover:bg-[#e6c800] disabled:opacity-60"
          >
            <GoogleMark />
            {pending === 'google' ? 'Opening…' : 'Google'}
          </button>
          <button
            type="button"
            onClick={() => start('microsoft')}
            disabled={pending !== null}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/15 px-3 text-xs font-semibold text-white transition-colors hover:border-white/35 disabled:opacity-60"
          >
            <MicrosoftMark />
            {pending === 'microsoft' ? 'Opening…' : 'Microsoft'}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-xs text-[#ff8a80]">
            {error}
          </p>
        )}
      </div>
    )
  }

  const { user } = session
  const isCommittee = user.roles.includes('committee')

  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
        {initials(user.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold text-white">{user.name}</span>
          {isCommittee && (
            <span className="shrink-0 rounded-sm border border-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-white/70">
              {user.team ?? 'Committee'}
            </span>
          )}
        </span>
        <span className="block truncate text-xs text-white/50">{user.email}</span>
      </span>
      <button
        type="button"
        onClick={() => signOutOfMac()}
        className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 text-white/60 transition-colors hover:border-white/30 hover:text-white"
        aria-label="Sign out"
        title="Sign out"
      >
        <LogOut size={15} />
      </button>
    </div>
  )
}

function linkProps(app: MacApp) {
  const external = /^https?:\/\//.test(app.url)
  return external ? { href: app.url, target: '_blank', rel: 'noopener noreferrer' } : { href: app.url }
}

function AppTile({ app, index, onNavigate }: { app: MacApp; index: number; onNavigate: () => void }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.025, ease: EASE_OUT }}
    >
      <a
        {...linkProps(app)}
        onClick={onNavigate}
        className="group relative flex h-full flex-col items-center gap-2.5 rounded-lg px-2 pb-3 pt-3.5 text-center no-underline outline-none transition-colors duration-200 hover:bg-white/[0.06] focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-accent"
      >
        <span className="relative transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:scale-[1.04]">
          <AppIcon name={app.glyph} size={52} />
          {app.badge && (
            <span className="absolute -right-2 -top-1.5 rounded-full bg-accent px-1.5 py-[3px] text-[8px] font-extrabold uppercase leading-none tracking-[0.08em] text-accent-foreground ring-2 ring-[#1C1C1C]">
              {app.badge}
            </span>
          )}
        </span>
        <span className="block">
          <span className="block text-[13px] font-semibold leading-tight text-white">{app.name}</span>
          <span className="mt-1 block text-[11px] leading-snug text-white/60">{app.summary}</span>
        </span>
      </a>
    </motion.li>
  )
}

interface AppLauncherProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AppLauncher({ open, onOpenChange }: AppLauncherProps) {
  const session = useMacSession()
  const pathname = usePathname()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handler = () => onOpenChange(true)
    window.addEventListener(OPEN_LAUNCHER_EVENT, handler)
    return () => window.removeEventListener(OPEN_LAUNCHER_EVENT, handler)
  }, [onOpenChange])

  useEffect(() => {
    onOpenChange(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!open) return
    panelRef.current?.focus({ preventScroll: true })

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
        buttonRef.current?.focus()
      }
    }
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open, onOpenChange])

  const isCommittee = session.status === 'signed-in' && session.user.roles.includes('committee')
  const close = () => onOpenChange(false)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => onOpenChange(!open)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={open}
        aria-controls="mac-app-launcher"
        aria-label="MAC apps"
        className={`relative flex h-10.5 shrink-0 cursor-pointer items-center gap-2.5 rounded-md border px-3 transition-colors duration-300 lg:h-auto lg:px-4 lg:py-2 ${
          open
            ? 'border-accent bg-accent text-accent-foreground hover:bg-[#e6c800]'
            : 'border-white/15 bg-white/[0.06] text-white hover:border-white/40'
        }`}
      >
        <LauncherDots active={hovered && !prefersReducedMotion} />
        <span className="hidden text-sm font-medium uppercase tracking-[0.05em] lg:inline">Apps</span>
        {session.status === 'signed-in' && (
          <span
            className={`grid size-5 place-items-center rounded-full text-[9px] font-bold ${
              open ? 'bg-[#252525] text-accent' : 'bg-accent text-accent-foreground'
            }`}
            aria-hidden
          >
            {initials(session.user.name)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="mac-app-launcher"
            role="dialog"
            aria-label="MAC apps"
            tabIndex={-1}
            className="fixed left-4 right-4 top-[4.75rem] z-[60] max-h-[calc(100svh-6rem)] origin-top-right overflow-y-auto rounded-xl border border-white/[0.12] bg-[#1C1C1C] outline-none sm:left-auto sm:w-[26rem] lg:right-12 lg:top-[5.75rem]"
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -10, clipPath: 'inset(0% 0% 100% 0% round 8px)' }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 8px)' }
            }
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6, transition: { duration: 0.16 } }}
            transition={{ duration: 0.42, ease: EASE_OUT }}
          >
            <AccountSection session={session} />

            <section className="border-t border-white/10 px-2 pb-2 pt-4">
              <h2 className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Apps</h2>
              <ul className="mt-2 grid grid-cols-3 gap-1">
                {PUBLIC_APPS.map((app, index) => (
                  <AppTile key={app.id} app={app} index={index} onNavigate={close} />
                ))}
              </ul>
            </section>

            {isCommittee && (
              <section className="border-t border-white/10 px-2 pb-2 pt-4">
                <h2 className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Committee
                </h2>
                <ul className="mt-2 flex flex-col">
                  {COMMITTEE_APPS.map((app) => (
                    <li key={app.id}>
                      <a
                        {...linkProps(app)}
                        onClick={close}
                        className="group flex items-center gap-3 rounded-md px-3 py-2.5 no-underline outline-none transition-colors hover:bg-white/[0.04] focus-visible:bg-white/[0.06] focus-visible:ring-1 focus-visible:ring-accent"
                      >
                        <AppIcon name={app.glyph} size={36} />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold text-white">{app.name}</span>
                          <span className="block truncate text-[11px] text-white/55">{app.host}</span>
                        </span>
                        <ArrowUpRight
                          size={15}
                          className="text-white/30 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <a
              href="https://github.com/monashcoding"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between border-t border-white/10 px-5 py-3.5 text-xs text-white/60 no-underline transition-colors hover:text-white"
            >
              <span>Most of these are open source</span>
              <span className="inline-flex items-center gap-1 font-semibold text-white/70 group-hover:text-accent">
                github.com/monashcoding
                <ArrowUpRight size={13} />
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
