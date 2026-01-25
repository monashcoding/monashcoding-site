import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const email = value.trim();
  // Basic email pattern; not exhaustive but sufficient for simple validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length > 0 && emailRegex.test(email);
}

export async function POST(req: Request) {
  try {
    // Get the form data from the request
    const body = await req.json();

    if (!body || typeof body !== 'object') {
      return Response.json(
        { error: 'Invalid request body; expected JSON object.' },
        { status: 400 },
      );
    }

    const {
      name,
      emailAddress,
      subject,
      message,
    } = body as {
      name?: unknown;
      emailAddress?: unknown;
      subject?: unknown;
      message?: unknown;
    };

    if (!isNonEmptyString(name)) {
      return Response.json(
        { error: 'Field "name" is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    if (!isValidEmail(emailAddress)) {
      return Response.json(
        { error: 'Field "emailAddress" is required and must be a valid email address.' },
        { status: 400 },
      );
    }

    if (!isNonEmptyString(message)) {
      return Response.json(
        { error: 'Field "message" is required and must be a non-empty string.' },
        { status: 400 },
      );
    }

    const normalizedSubject =
      typeof subject === 'string' && subject.trim().length > 0
        ? subject
        : 'New Message from Monash Coding Site';

    const { data, error } = await resend.emails.send({
      from: 'noreply@monashcoding.com', 
      // to: 'coding@monashclubs.org',
      to: 'projects@monashcoding.com',
      replyTo: (emailAddress as string).trim(), // User's email will be set as reply-to
      subject: normalizedSubject, 
      react: EmailTemplate({
        name: (name as string).trim(),
        emailAddress: (emailAddress as string).trim(),
        subject: normalizedSubject,
        message: (message as string).trim(),
      }),
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Catch error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}