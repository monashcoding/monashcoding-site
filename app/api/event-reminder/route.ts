import { clientAddress, handleRoute, parseBody } from '@monashcoding/server';
import { z } from 'zod';
import { logger } from '@/lib/log';
import type { NoParams } from '@/lib/route';
import { reminderLimiter } from '@/lib/rate-limit';
import { getResend } from '@/lib/resend';

const segmentCache = new Map<string, string>();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

const log = logger.child('event-reminder');

const reminder = z.object({
  email: z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
  eventSlug: z.string().trim().min(1, 'Event slug is required.'),
});

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRateLimit =
        err instanceof Error && err.message.includes('rate_limit');

      if (!isRateLimit || attempt === MAX_RETRIES - 1) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
    }
  }

  throw new Error('Max retries exceeded');
}

function isResendRateLimited(error: { statusCode: number | null; name: string } | null): boolean {
  return error?.statusCode === 429 || error?.name === 'rate_limit_exceeded';
}

async function findOrCreateSegment(slug: string): Promise<string> {
  const segmentName = `event-${slug}`;

  const cached = segmentCache.get(segmentName);

  if (cached) return cached;

  const { data: listData } = await withRetry(async () => {
    const res = await getResend().segments.list();

    if (isResendRateLimited(res.error)) throw new Error('rate_limit');

    if (res.error) throw new Error(`Failed to list segments: ${res.error.message}`);

    return res;
  });

  const existing = listData?.data?.find((s) => s.name === segmentName);

  if (existing) {
    segmentCache.set(segmentName, existing.id);

    return existing.id;
  }

  const { data: createData } = await withRetry(async () => {
    const res = await getResend().segments.create({ name: segmentName });

    if (isResendRateLimited(res.error)) throw new Error('rate_limit');

    if (res.error) throw new Error(`Failed to create segment: ${res.error.message}`);

    return res;
  });

  segmentCache.set(segmentName, createData!.id);

  return createData!.id;
}

export const POST = handleRoute<NoParams>(async (request) => {
  reminderLimiter.enforce(clientAddress(request.headers));

  const { email, eventSlug } = await parseBody(request, reminder);
  const segmentId = await findOrCreateSegment(eventSlug);

  const { data } = await withRetry(async () => {
    const res = await getResend().contacts.create({
      email,
      audienceId: segmentId,
      unsubscribed: false,
    });

    if (isResendRateLimited(res.error)) throw new Error('rate_limit');

    if (res.error) {
      throw new Error(`Failed to sign up for reminder: ${res.error.name}: ${res.error.message}`);
    }

    return res;
  });

  return Response.json(data);
}, { logger: log });
