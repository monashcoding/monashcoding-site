import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Get the form data from the request
    const { name, emailAddress, subject, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'noreply@monashcoding.com', 
      // to: 'coding@monashclubs.org',
      to: 'projects@monashcoding.com',
      replyTo: emailAddress, // User's email will be set as reply-to
      subject: subject || 'New Message from Monash Coding Site', 
      react: EmailTemplate({ name, emailAddress, subject, message }),
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