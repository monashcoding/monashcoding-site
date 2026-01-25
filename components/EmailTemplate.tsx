import * as React from 'react';

export interface EmailTemplateProps {
  name: string;
  emailAddress: string;
  subject?: string;
  message: string;
}

export function EmailTemplate({ name, emailAddress, subject, message }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f7f4', padding: '0', margin: '0' }}>
      {/* Main Container */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f8f7f4' }}>
        <tbody>
          {/* Header with Gradient */}
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px' }}>
                <tbody>
                  <tr>
                    <td style={{
                      background: 'linear-gradient(135deg, #b8860b 0%, #daa520 100%)',
                      padding: '40px 30px',
                      borderRadius: '12px 12px 0 0',
                      textAlign: 'center'
                    }}>
                      <h1 style={{
                        color: '#ffffff',
                        margin: '0',
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        New Message Received
                      </h1>
                      <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        margin: '10px 0 0 0',
                        fontSize: '14px'
                      }}>
                        Someone wants to connect with you
                      </p>
                    </td>
                  </tr>

                  {/* Content Section */}
                  <tr>
                    <td style={{
                      backgroundColor: '#ffffff',
                      padding: '40px 30px',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      {/* Greeting */}
                      <p style={{
                        color: '#1a1a1a',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        margin: '0 0 25px 0'
                      }}>
                        Hi there, you have a new contact form submission:
                      </p>

                      {/* Contact Details Card */}
                      <div style={{
                        backgroundColor: '#f8f7f4',
                        borderLeft: '4px solid #b8860b',
                        padding: '20px',
                        borderRadius: '6px',
                        marginBottom: '25px'
                      }}>
                        {/* Name */}
                        <div style={{ marginBottom: '15px' }}>
                          <span style={{
                            display: 'block',
                            color: '#b8860b',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            From
                          </span>
                          <span style={{
                            color: '#1a1a1a',
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            {name}
                          </span>
                        </div>

                        {/* Email */}
                        <div style={{ marginBottom: '15px' }}>
                          <span style={{
                            display: 'block',
                            color: '#b8860b',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            Email
                          </span>
                          <a href={`mailto:${emailAddress}`} style={{
                            color: '#0066cc',
                            fontSize: '14px',
                            textDecoration: 'none',
                            borderBottom: '1px solid #0066cc'
                          }}>
                            {emailAddress}
                          </a>
                        </div>

                        {/* Subject (if provided) */}
                        {subject && (
                          <div>
                            <span style={{
                              display: 'block',
                              color: '#b8860b',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: '4px'
                            }}>
                              Subject
                            </span>
                            <span style={{
                              color: '#1a1a1a',
                              fontSize: '14px',
                              fontWeight: '600'
                            }}>
                              {subject}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Message Section */}
                      <div style={{ marginBottom: '25px' }}>
                        <span style={{
                          display: 'block',
                          color: '#b8860b',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '10px'
                        }}>
                          Message
                        </span>
                        <div style={{
                          backgroundColor: '#f8f7f4',
                          padding: '20px',
                          borderRadius: '6px',
                          color: '#1a1a1a',
                          lineHeight: '1.8',
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}>
                          {message}
                        </div>
                      </div>

                      {/* Call to Action Button */}
                      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <a href={`mailto:${emailAddress}`} style={{
                          display: 'inline-block',
                          backgroundColor: '#b8860b',
                          color: '#ffffff',
                          padding: '14px 32px',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          transition: 'background-color 0.3s ease'
                        }}>
                          Reply to {name.split(' ')[0]}
                        </a>
                      </div>

                      {/* Footer Note */}
                      <p style={{
                        color: '#666666',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        borderTop: '1px solid #e0e0e0',
                        paddingTop: '20px',
                        margin: '0'
                      }}>
                        This email was sent from your Monash Coding contact form.<br />
                        <span style={{ color: '#999999' }}>Please reply directly to this email or contact {emailAddress}</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Bottom Brand Section */}
          <tr>
            <td align="center" style={{ padding: '30px 20px' }}>
              <p style={{
                color: '#999999',
                fontSize: '12px',
                margin: '0',
                textAlign: 'center'
              }}>
                <strong style={{ color: '#b8860b' }}>Monash Coding</strong><br />
                Monash University, Clayton VIC<br />
                <a href="https://monashcoding.com" style={{ color: '#b8860b', textDecoration: 'none' }}>
                  monashcoding.com
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}