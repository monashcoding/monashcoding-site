import * as React from 'react';

export interface EmailTemplateProps {
  name: string;
  emailAddress: string;
  subject?: string;
  message: string;
}

export function EmailTemplate({ name, emailAddress, subject, message }: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#252525', padding: '0', margin: '0' }}>
      {/* Main Container */}
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#252525' }}>
        <tbody>
          {/* Header with Gradient */}
          <tr>
            <td align="center" style={{ padding: '40px 20px' }}>
              <table width="600" cellPadding="0" cellSpacing="0" style={{ maxWidth: '600px' }}>
                <tbody>
                  <tr>
                    <td style={{
                      background: 'linear-gradient(135deg, #FFE330 0%, #ffd700 100%)',
                      padding: '40px 30px',
                      borderRadius: '12px 12px 0 0',
                      textAlign: 'center'
                    }}>
                      <h1 style={{
                        color: '#252525',
                        margin: '0',
                        fontSize: '28px',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        New Message Received
                      </h1>
                      <p style={{
                        color: 'rgba(37,37,37,0.8)',
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
                      backgroundColor: '#1a1a1a',
                      padding: '40px 30px',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      {/* Greeting */}
                      <p style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        margin: '0 0 25px 0'
                      }}>
                        Hi there, you have a new contact form submission:
                      </p>

                      {/* Contact Details Card */}
                      <div style={{
                        backgroundColor: '#252525',
                        borderLeft: '4px solid #FFE330',
                        padding: '20px',
                        borderRadius: '6px',
                        marginBottom: '25px'
                      }}>
                        {/* Name */}
                        <div style={{ marginBottom: '15px' }}>
                          <span style={{
                            display: 'block',
                            color: '#FFE330',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            From
                          </span>
                          <span style={{
                            color: '#ffffff',
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
                            color: '#FFE330',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            Email
                          </span>
                          <a href={`mailto:${emailAddress}`} style={{
                            color: '#5757D3',
                            fontSize: '14px',
                            textDecoration: 'none',
                            borderBottom: '1px solid #5757D3'
                          }}>
                            {emailAddress}
                          </a>
                        </div>

                        {/* Subject */}
                        {subject && (
                          <div style={{ marginBottom: '0' }}>
                            <span style={{
                              display: 'block',
                              color: '#FFE330',
                              fontSize: '12px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                              letterSpacing: '1px',
                              marginBottom: '4px'
                            }}>
                              Subject
                            </span>
                            <span style={{
                              color: '#ffffff',
                              fontSize: '16px',
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
                          color: '#FFE330',
                          fontSize: '12px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          marginBottom: '10px'
                        }}>
                          Message
                        </span>
                        <div style={{
                          backgroundColor: '#252525',
                          padding: '20px',
                          borderRadius: '6px',
                          color: '#ffffff',
                          lineHeight: '1.8',
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word',
                          border: '1px solid #404040'
                        }}>
                          {message}
                        </div>
                      </div>

                      {/* Call to Action Button */}
                      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <a href={`mailto:${emailAddress}`} style={{
                          display: 'inline-block',
                          backgroundColor: '#FFE330',
                          color: '#252525',
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
                        color: '#a0a0a0',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        borderTop: '1px solid #404040',
                        paddingTop: '20px',
                        margin: '0'
                      }}>
                        This email was sent from your Monash Coding contact form.<br />
                        <span style={{ color: '#707070' }}>Please reply directly to this email or contact {emailAddress}</span>
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
                color: '#a0a0a0',
                fontSize: '12px',
                margin: '0',
                textAlign: 'center'
              }}>
                <strong style={{ color: '#FFE330' }}>Monash Coding</strong><br />
                Monash University, Clayton VIC<br />
                <a href="https://monashcoding.com" style={{ color: '#FFE330', textDecoration: 'none' }}>
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