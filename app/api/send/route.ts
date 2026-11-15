import { clientAddress, handleRoute, parseBody } from '@monashcoding/server';
import { groq } from 'next-sanity';
import { z } from 'zod';
import { EmailTemplate } from '@/components/contact/EmailTemplate';
import { logger } from '@/lib/log';
import type { NoParams } from '@/lib/route';
import { contactLimiter } from '@/lib/rate-limit';
import { getResend } from '@/lib/resend';
import { client } from '@/sanity/lib/client';

const FALLBACK_FROM = 'noreply@monashcoding.com';
const FALLBACK_TO = 'projects@monashcoding.com';
const DEFAULT_SUBJECT = 'New Message from Monash Coding Site';

const emailConfigQuery = groq`*[_type == "contactPage"][0]{ senderEmail, recipientEmail }`;

const log = logger.child('send');

const text = z.string().trim().min(1);

// Basic email pattern; not exhaustive but sufficient for simple validation
const email = z.string().trim().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Must be a valid email address.');

const sponsorForm = z.object({
  type: z.literal('sponsor'),
  companyName: text,
  contactName: text,
  email,
  message: text,
});

const contactForm = z.object({
  name: text,
  emailAddress: email,
  // A missing, blank or non-string subject falls back to the default
  subject: z.string().refine((value) => value.trim().length > 0).catch(DEFAULT_SUBJECT),
  message: text,
});

type Form = z.infer<typeof sponsorForm> | z.infer<typeof contactForm>;

// A body without `type: "sponsor"` is the regular contact form
const anyForm = z.looseObject({});

function parseForm(body: z.infer<typeof anyForm>): Form {
  return body.type === 'sponsor' ? sponsorForm.parse(body) : contactForm.parse(body);
}

interface Email {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  name: string;
  message: string;
}

async function toEmail(body: Form): Promise<Email> {
  if ('type' in body) {
    const subject = `Sponsorship Inquiry from ${body.companyName}`;

    return {
      from: 'noreply@monashcoding.com',
      to: 'sponsorship@monashcoding.com',
      replyTo: body.email,
      subject,
      name: `${body.contactName} (${body.companyName})`,
      message: body.message,
    };
  }

  // Fetch email config from Sanity
  const config = await client.fetch<{ senderEmail?: string; recipientEmail?: string } | null>(emailConfigQuery);

  return {
    from: config?.senderEmail || FALLBACK_FROM,
    to: config?.recipientEmail || FALLBACK_TO,
    replyTo: body.emailAddress, // User's email will be set as reply-to
    subject: body.subject,
    name: body.name,
    message: body.message,
  };
}

export const POST = handleRoute<NoParams>(async (request) => {
  contactLimiter.enforce(clientAddress(request.headers));

  const body = await parseBody(request, anyForm);
  const mail = await toEmail(parseForm(body));

  const { data, error } = await getResend().emails.send({
    from: mail.from,
    to: mail.to,
    replyTo: mail.replyTo,
    subject: mail.subject,
    react: EmailTemplate({
      name: mail.name,
      emailAddress: mail.replyTo,
      subject: mail.subject,
      message: mail.message,
    }),
  });

  if (error) {
    throw new Error(`Resend rejected the email: ${error.name}: ${error.message}`);
  }

  return Response.json(data);
}, { logger: log });
