import { EventReminderEmailTemplate } from '@/components/events/EventReminderEmailTemplate';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey || apiKey.trim().length === 0) {
  throw new Error(
    'RESEND_API_KEY is not configured. Please set the RESEND_API_KEY environment variable.'
  );
}

const resend = new Resend(apiKey);

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length > 0 && emailRegex.test(email);
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

    const { email, eventTitle, eventDate } = body as {
      email?: unknown;
      eventTitle?: unknown;
      eventDate?: unknown;
    };

    if (!isValidEmail(email)) {
      return Response.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }

    if (typeof eventTitle !== 'string' || !eventTitle.trim()) {
      return Response.json(
        { error: 'Event title is required.' },
        { status: 400 },
      );
    }

    if (typeof eventDate !== 'string' || !eventDate.trim()) {
      return Response.json(
        { error: 'Event date is required.' },
        { status: 400 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'noreply@monashcoding.com',
      to: (email as string).trim(),
      subject: `Reminder: ${eventTitle.trim()}`,
      react: EventReminderEmailTemplate({
        eventTitle: eventTitle.trim(),
        eventDate: eventDate.trim(),
      }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error: 'Failed to send reminder email.' }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Event reminder error:', error);
    return Response.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
