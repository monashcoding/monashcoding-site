'use client'

import { useEffect, useState } from 'react'

export const MAC_AUTH_URL = process.env.NEXT_PUBLIC_MAC_AUTH_URL ?? 'https://auth.monashcoding.com'

export type MacProvider = 'google' | 'microsoft'

export interface MacUser {
  macUserId: string
  name: string
  email: string
  roles: string[]
  team: string | null
}

export type MacSession =
  | { status: 'loading' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; user: MacUser }

// The site only reads the token to decide what to show. Apps that act on it verify it
// against the JWKS themselves, so decoding without verification is fine here.
function decodeClaims(token: string): MacUser | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const claims = JSON.parse(json)
    if (!claims.macUserId) return null
    return {
      macUserId: claims.macUserId,
      name: claims.name || claims.email,
      email: claims.email,
      roles: Array.isArray(claims.roles) ? claims.roles : [],
      team: claims.team ?? null,
    }
  } catch {
    return null
  }
}

function mockUser(): MacUser | null {
  if (process.env.NODE_ENV === 'production') return null
  const mock = process.env.NEXT_PUBLIC_MAC_AUTH_MOCK
  if (mock !== 'member' && mock !== 'committee') return null
  return {
    macUserId: 'dev-user',
    name: 'Alex Chen',
    email: 'alex.chen@student.monash.edu',
    roles: mock === 'committee' ? ['member', 'committee'] : ['member'],
    team: mock === 'committee' ? 'Projects' : null,
  }
}

let sessionRequest: Promise<MacUser | null> | null = null

function fetchUser(): Promise<MacUser | null> {
  const mock = mockUser()
  if (mock) return Promise.resolve(mock)
  sessionRequest ??= fetch(`${MAC_AUTH_URL}/api/auth/token`, { credentials: 'include' })
    .then(async (res) => {
      if (!res.ok) return null
      const { token } = await res.json()
      return typeof token === 'string' ? decodeClaims(token) : null
    })
    .catch(() => null)
  return sessionRequest
}

export function useMacSession(): MacSession {
  const [session, setSession] = useState<MacSession>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    fetchUser().then((user) => {
      if (cancelled) return
      setSession(user ? { status: 'signed-in', user } : { status: 'signed-out' })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return session
}

export async function signInWithMac(provider: MacProvider): Promise<void> {
  const res = await fetch(`${MAC_AUTH_URL}/api/auth/sign-in/social`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ provider, callbackURL: window.location.href }),
  })
  if (!res.ok) throw new Error(`sign-in failed (${res.status})`)
  const { url } = await res.json()
  window.location.assign(url)
}

export async function signOutOfMac(): Promise<void> {
  if (mockUser()) {
    window.location.reload()
    return
  }
  await fetch(`${MAC_AUTH_URL}/api/auth/sign-out`, { method: 'POST', credentials: 'include' })
  sessionRequest = null
  window.location.reload()
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
