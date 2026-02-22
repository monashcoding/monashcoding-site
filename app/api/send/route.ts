import { EmailTemplate } from '@/components/contact/EmailTemplate';
import { Resend } from 'resend';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

// Validate RESEND_API_KEY is configured
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey || apiKey.trim().length === 0) {
  throw new Error(
    'RESEND_API_KEY is not configured. Please set the RESEND_API_KEY environment variable.'
  );
}

const resend = new Resend(apiKey);

const FALLBACK_FROM = 'noreply@monashcoding.com';
const FALLBACK_TO = 'projects@monashcoding.com';

const emailConfigQuery = groq`*[_type == "contactPage"][0]{ senderEmail, recipientEmail }`;

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

    const formType = body.type as string | undefined;

    // Handle sponsor form
    if (formType === 'sponsor') {
      const {
        companyName,
        contactName,
        email,
        message,
      } = body as {
        companyName?: unknown;
        contactName?: unknown;
        email?: unknown;
        message?: unknown;
      };

      if (!isNonEmptyString(companyName)) {
        return Response.json(
          { error: 'Field "companyName" is required and must be a non-empty string.' },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(contactName)) {
        return Response.json(
          { error: 'Field "contactName" is required and must be a non-empty string.' },
          { status: 400 },
        );
      }

      if (!isValidEmail(email)) {
        return Response.json(
          { error: 'Field "email" is required and must be a valid email address.' },
          { status: 400 },
        );
      }

      if (!isNonEmptyString(message)) {
        return Response.json(
          { error: 'Field "message" is required and must be a non-empty string.' },
          { status: 400 },
        );
      }

      const { data, error } = await resend.emails.send({
        from: 'noreply@monashcoding.com',
        to: 'sponsorship@monashcoding.com',
        replyTo: (email as string).trim(),
        subject: `Sponsorship Inquiry from ${companyName}`,
        react: EmailTemplate({
          name: `${contactName} (${companyName})`,
          emailAddress: (email as string).trim(),
          subject: `Sponsorship Inquiry from ${companyName}`,
          message: (message as string).trim(),
        }),
      });

      if (error) {
        console.error('Resend API error:', error);
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    }

    // Handle regular contact form (default)
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

    // Fetch email config from Sanity
    const config = await client.fetch<{ senderEmail?: string; recipientEmail?: string } | null>(emailConfigQuery);
    const fromEmail = config?.senderEmail || FALLBACK_FROM;
    const toEmail = config?.recipientEmail || FALLBACK_TO;

    const normalizedSubject =
      typeof subject === 'string' && subject.trim().length > 0
        ? subject
        : 'New Message from Monash Coding Site';

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
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
