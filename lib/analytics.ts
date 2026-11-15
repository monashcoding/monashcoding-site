import { createAnalytics } from '@monashcoding/analytics/client'
import { env } from '@/lib/env'

export const analytics = createAnalytics({
  app: 'monashcoding-site',
  posthogToken: env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
  gaId: env.NEXT_PUBLIC_GA_ID,
})
