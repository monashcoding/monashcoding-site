import * as React from 'react';

export interface EmailTemplateProps {
  name: string;
  emailAddress: string;
  phone?: string;
  message: string;
}

export function EmailTemplate({ name, emailAddress, phone, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Email: {emailAddress}</p>
      {phone && <p>Phone: {phone}</p>}
      <p>Message: {message}</p>
    </div>
  );
}