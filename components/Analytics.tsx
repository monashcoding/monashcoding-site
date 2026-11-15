'use client'

import { MacAnalytics } from '@monashcoding/analytics/react'
import { useMacSession } from '@monashcoding/auth/react'
import { analytics } from '@/lib/analytics'
import { macAuth } from '@/lib/mac-auth'

export function Analytics() {
  const session = useMacSession(macAuth)
  const userId = session.status === 'loading' ? undefined : (session.user?.macUserId ?? null)

  return <MacAnalytics analytics={analytics} userId={userId} />
}
