'use client'

import { useState } from 'react'

interface EventReminderFormProps {
  label: string
  eventTitle: string
  eventDate: string
  eventSlug: string
}

export function EventReminderForm({ label, eventTitle, eventDate, eventSlug }: EventReminderFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/event-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          eventTitle,
          eventDate,
          eventSlug,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-center text-sm text-green-400">
        Reminder set! Check your inbox.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="event-reminder-email" className="sr-only">
        Email for reminder
      </label>
      <input
        id="event-reminder-email"
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === 'loading'}
        className="w-full rounded-xl border border-white/14 bg-black/28 px-4 py-3 text-sm text-foreground placeholder:text-white/40 focus:border-accent/50 focus:outline-none disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="group flex w-full items-center justify-center gap-2 rounded-full border border-accent/70 bg-accent px-5 py-3 text-center text-sm font-semibold tracking-[0.08em] uppercase text-accent-foreground transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
      >
        <span>{status === 'loading' ? 'Signing up...' : label}</span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="shrink-0"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </button>
      {status === 'error' && (
        <p className="text-center text-xs text-red-400">{errorMessage}</p>
      )}
    </form>
  )
}
