import Image from 'next/image'
import type { AppGlyph } from '@/lib/apps'

function MonMapIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#5B2D9E" />
      <path d="M11 15.5 19.5 12.5 28.5 15.5 37 12.5v20l-8.5 3-9-3-8.5 3z" fill="#F5F1FC" />
      <path d="M19.5 12.5v20l9 3v-20z" fill="#DCD1EF" />
      <path
        d="M14.5 30.5c3.5-5.5 7.5-.5 10.5-5.5s4.5-6 7.5-7"
        fill="none"
        stroke="#5B2D9E"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeDasharray="2.3 2.6"
      />
      <circle cx="33" cy="17.5" r="3.6" fill="#FFE330" stroke="#5B2D9E" strokeWidth="1.6" />
    </>
  )
}

function JobsIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#FFE330" />
      <path d="M19 17.5v-3a2.5 2.5 0 0 1 2.5-2.5h5a2.5 2.5 0 0 1 2.5 2.5v3" fill="none" stroke="#252525" strokeWidth="2.6" />
      <rect x="10.5" y="17" width="27" height="19.5" rx="4" fill="#252525" />
      <path d="M10.5 25.5h27" stroke="#FFE330" strokeWidth="1.4" strokeOpacity=".55" />
      <rect x="21" y="22.5" width="6" height="6" rx="1.5" fill="#FFE330" />
    </>
  )
}

function VerifyIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#F2F0E8" />
      <path
        d="M9.5 17.5a2.5 2.5 0 0 1 2.5-2.5h24a2.5 2.5 0 0 1 2.5 2.5v3.3a3.4 3.4 0 0 0 0 6.4v3.3a2.5 2.5 0 0 1-2.5 2.5H12a2.5 2.5 0 0 1-2.5-2.5v-3.3a3.4 3.4 0 0 0 0-6.4z"
        fill="#252525"
      />
      <path d="M29.5 17.5v13" stroke="#F2F0E8" strokeWidth="1.4" strokeDasharray="1.6 1.9" />
      <path d="m15.5 22 2.5-3 2.5 3M15.5 26l2.5 3 2.5-3" fill="none" stroke="#FFE330" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34.5" cy="33.5" r="6.5" fill="#FFE330" stroke="#F2F0E8" strokeWidth="2" />
      <path d="m31.6 33.6 2 2 3.6-3.9" fill="none" stroke="#252525" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </>
  )
}

function QuizIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#FFE330" />
      <path d="M11 15a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-8l-6.5 5.5V31H15a4 4 0 0 1-4-4z" fill="#2563EB" />
      <path d="M20.5 17.5a3.5 3.5 0 1 1 5 3.2c-1 .5-1.5 1.2-1.5 2.4" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" />
      <circle cx="24" cy="26.6" r="1.4" fill="#fff" />
    </>
  )
}

function StudioIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#2B2B2B" />
      <rect x=".5" y=".5" width="47" height="47" rx="11.5" fill="none" stroke="#fff" strokeOpacity=".12" />
      <path d="M13 16h15M13 21.5h11M13 27h7" stroke="#fff" strokeOpacity=".85" strokeWidth="2.4" strokeLinecap="round" />
      <path d="m22.5 35.5 1.4-5.2 9.8-9.8a2.6 2.6 0 0 1 3.7 3.7l-9.8 9.8z" fill="#FFE330" />
    </>
  )
}

function CrmIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#127A63" />
      <rect x="10.5" y="11.5" width="8" height="25" rx="2.5" fill="#fff" fillOpacity=".18" />
      <rect x="20" y="11.5" width="8" height="25" rx="2.5" fill="#fff" fillOpacity=".18" />
      <rect x="29.5" y="11.5" width="8" height="25" rx="2.5" fill="#fff" fillOpacity=".18" />
      <rect x="11.75" y="13" width="5.5" height="5.5" rx="1.5" fill="#fff" />
      <rect x="11.75" y="20" width="5.5" height="5.5" rx="1.5" fill="#fff" />
      <rect x="11.75" y="27" width="5.5" height="5.5" rx="1.5" fill="#fff" />
      <rect x="21.25" y="13" width="5.5" height="5.5" rx="1.5" fill="#fff" />
      <rect x="21.25" y="20" width="5.5" height="5.5" rx="1.5" fill="#fff" />
      <rect x="30.75" y="13" width="5.5" height="5.5" rx="1.5" fill="#FFE330" />
    </>
  )
}

function MailIcon() {
  return (
    <>
      <rect width="48" height="48" rx="12" fill="#1F5FD1" />
      <rect x="10.5" y="15" width="27" height="19" rx="3.5" fill="#fff" />
      <path d="m11.5 16.8 12.5 9 12.5-9" fill="none" stroke="#1F5FD1" strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="36" cy="15" r="5" fill="#FFE330" stroke="#1F5FD1" strokeWidth="2.2" />
    </>
  )
}

const ICONS: Partial<Record<AppGlyph, () => React.ReactElement>> = {
  monmap: MonMapIcon,
  jobs: JobsIcon,
  verify: VerifyIcon,
  quiz: QuizIcon,
  studio: StudioIcon,
  crm: CrmIcon,
  mail: MailIcon,
}

export function AppIcon({ name, size = 48, className = '' }: { name: AppGlyph; size?: number; className?: string }) {
  if (name === 'study') {
    return (
      <Image
        src="/apps/study-icon.png"
        alt=""
        width={size}
        height={size}
        className={`shrink-0 rounded-[25%] ${className}`}
        aria-hidden
      />
    )
  }
  const Icon = ICONS[name]
  if (!Icon) return null
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} className={`shrink-0 ${className}`} aria-hidden>
      <Icon />
    </svg>
  )
}
