import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey || apiKey.trim().length === 0) {
  throw new Error(
    'RESEND_API_KEY is not configured. Please set the RESEND_API_KEY environment variable.'
  );
}

const resend = new Resend(apiKey);

const segmentCache = new Map<string, string>();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isResendRateLimited(error: any): boolean {
  return error?.statusCode === 429 || error?.name === 'rate_limit_exceeded';
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length > 0 && emailRegex.test(email);
}

async function findOrCreateSegment(slug: string): Promise<string> {
  const segmentName = `event-${slug}`;

  const cached = segmentCache.get(segmentName);
  if (cached) return cached;

  const { data: listData } = await withRetry(async () => {
    const res = await resend.segments.list();
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
    const res = await resend.segments.create({ name: segmentName });
    if (isResendRateLimited(res.error)) throw new Error('rate_limit');
    if (res.error) throw new Error(`Failed to create segment: ${res.error.message}`);
    return res;
  });

  segmentCache.set(segmentName, createData!.id);
  return createData!.id;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return Response.json(
        { error: 'Invalid request body.' },
        { status: 400 },
      );
    }

    const { email, eventSlug } = body as {
      email?: unknown;
      eventSlug?: unknown;
    };

    if (!isValidEmail(email)) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    if (typeof eventSlug !== 'string' || !eventSlug.trim()) {
      return Response.json(
        { error: 'Event slug is required.' },
        { status: 400 },
      );
    }

    const segmentId = await findOrCreateSegment(eventSlug.trim());

    const { data } = await withRetry(async () => {
      const res = await resend.contacts.create({
        email: (email as string).trim(),
        audienceId: segmentId,
        unsubscribed: false,
      });
      if (isResendRateLimited(res.error)) throw new Error('rate_limit');
      if (res.error) {
        console.error('Resend contacts error:', res.error);
        throw new Error('Failed to sign up for reminder.');
      }
      return res;
    });

    return Response.json(data);
  } catch (error) {
    console.error('Event reminder error:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
