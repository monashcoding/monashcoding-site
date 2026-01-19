import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Get the form data from the request
    const { name, emailAddress, phone, subject, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: emailAddress,
      to: 'coding@monashclubs.org',
      subject: subject || 'New Message from Monash Coding Site', 
      react: EmailTemplate({ name, emailAddress, phone, message }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Catch error:', error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}