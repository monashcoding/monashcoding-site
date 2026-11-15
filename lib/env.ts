import { defineEnv, env as e } from '@monashcoding/server'
import { z } from 'zod'

// The one place the environment is read. Every variable is named literally so Next
// can inline the NEXT_PUBLIC_* ones into the browser bundle, where the rest are unset.
// Secrets are optional: the Docker build runs without them and only the API routes use
// them, at request time.
export const env = defineEnv(
  {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
    NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
    NEXT_PUBLIC_SANITY_API_VERSION: z.string().optional(),
    SANITY_STUDIO_PROJECT_ID: z.string().optional(),
    SANITY_STUDIO_DATASET: z.string().optional(),
    SANITY_STUDIO_API_VERSION: z.string().optional(),

    NEXT_PUBLIC_MAC_AUTH_URL: e.url().default('https://auth.monashcoding.com'),
    NEXT_PUBLIC_MAC_AUTH_MOCK: z.string().optional(),

    // The measurement ID is public (it ships in every page), so it has a default.
    NEXT_PUBLIC_GA_ID: z.string().default('G-69933Q0KLF'),
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: z.string().optional(),

    RESEND_API_KEY: z.string().optional(),
    SANITY_WEBHOOK_SECRET: z.string().optional(),

    YOUTUBE_CHANNEL_ID: z.string().default('UCxEz0QrpHJyLiWsVFgfUrRw'),
    YOUTUBE_CHANNEL_HANDLE: z.string().default('MonashAssociationofCoding'),
    YOUTUBE_PLAYLIST_ID: z.string().optional(),

    ANALYZE: e.flag(),
  },
  {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
    SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
    SANITY_STUDIO_API_VERSION: process.env.SANITY_STUDIO_API_VERSION,
    NEXT_PUBLIC_MAC_AUTH_URL: process.env.NEXT_PUBLIC_MAC_AUTH_URL,
    NEXT_PUBLIC_MAC_AUTH_MOCK: process.env.NEXT_PUBLIC_MAC_AUTH_MOCK,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID,
    YOUTUBE_CHANNEL_HANDLE: process.env.YOUTUBE_CHANNEL_HANDLE,
    YOUTUBE_PLAYLIST_ID: process.env.YOUTUBE_PLAYLIST_ID,
    ANALYZE: process.env.ANALYZE,
  },
)
