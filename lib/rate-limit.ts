import { createRateLimiter } from '@monashcoding/server'

// Keyed by client address. Campus Wi-Fi puts many students behind one address, so the
// limits leave room for a room full of people signing up at an event.
export const contactLimiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 })
export const reminderLimiter = createRateLimiter({ limit: 30, windowMs: 10 * 60_000 })
