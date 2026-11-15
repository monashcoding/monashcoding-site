import { createMacAuthClient, type MacSession } from '@monashcoding/auth/client'
import { env } from '@/lib/env'

// localhost is not a trusted origin for auth.monashcoding.com, so outside production
// NEXT_PUBLIC_MAC_AUTH_MOCK=member|committee answers the token request with a made-up
// session. The token is unsigned: the browser client only decodes it for display.
function mockToken(mock: 'member' | 'committee'): string {
  const encode = (json: string) =>
    btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

  const claims = {
    macUserId: 'dev-user',
    name: 'Alex Chen',
    email: 'alex.chen@student.monash.edu',
    roles: mock === 'committee' ? ['member', 'committee'] : ['member'],
    team: mock === 'committee' ? 'Projects' : null,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  }

  return `${encode(JSON.stringify({ alg: 'none', typ: 'JWT' }))}.${encode(JSON.stringify(claims))}.mock`
}

function mockFetch(): typeof fetch | undefined {
  if (env.NODE_ENV === 'production') return undefined
  const mock = env.NEXT_PUBLIC_MAC_AUTH_MOCK

  if (mock !== 'member' && mock !== 'committee') return undefined

  return async (input, init) => {
    const url = input instanceof Request ? input.url : String(input)

    if (url === `${env.NEXT_PUBLIC_MAC_AUTH_URL}/api/auth/token`) {
      return Response.json({ token: mockToken(mock) })
    }

    if (url === `${env.NEXT_PUBLIC_MAC_AUTH_URL}/api/auth/sign-out`) {
      return Response.json({})
    }

    return fetch(input, init)
  }
}

export const macAuth = createMacAuthClient({
  authUrl: env.NEXT_PUBLIC_MAC_AUTH_URL,
  fetch: mockFetch(),
})

export async function signOutOfMac(): Promise<void> {
  await macAuth.signOut()
  window.location.reload()
}

// mac-auth sends an empty name for an account that has none.
export function displayName(user: NonNullable<MacSession['user']>): string {
  return user.name || user.email
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const first = parts[0]
  const last = parts.at(-1)

  if (!first || !last) return '?'

  if (parts.length === 1) return first.slice(0, 2).toUpperCase()

  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}
