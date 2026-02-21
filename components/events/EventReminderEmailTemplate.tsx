import * as React from 'react';

export interface EventReminderEmailTemplateProps {
  eventTitle: string;
  eventDate: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Australia/Melbourne',
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Australia/Melbourne',
  });
}

export function EventReminderEmailTemplate({ eventTitle, eventDate }: EventReminderEmailTemplateProps) {
  const formattedDate = formatDate(eventDate);
  const formattedTime = formatTime(eventDate);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#252525', padding: '0', margin: '0' }}>
      <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#252525' }}>
        <tbody>
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
                        You&apos;re Signed Up!
                      </h1>
                      <p style={{
                        color: 'rgba(37,37,37,0.8)',
                        margin: '10px 0 0 0',
                        fontSize: '14px'
                      }}>
                        We&apos;ll remind you before the event
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style={{
                      backgroundColor: '#1a1a1a',
                      padding: '40px 30px',
                      borderRadius: '0 0 12px 12px'
                    }}>
                      <p style={{
                        color: '#ffffff',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        margin: '0 0 25px 0'
                      }}>
                        You&apos;ve signed up for a reminder for the following event:
                      </p>

                      <div style={{
                        backgroundColor: '#252525',
                        borderLeft: '4px solid #FFE330',
                        padding: '20px',
                        borderRadius: '6px',
                        marginBottom: '25px'
                      }}>
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
                            Event
                          </span>
                          <span style={{
                            color: '#ffffff',
                            fontSize: '18px',
                            fontWeight: '600'
                          }}>
                            {eventTitle}
                          </span>
                        </div>

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
                            Date
                          </span>
                          <span style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            {formattedDate}
                          </span>
                        </div>

                        <div>
                          <span style={{
                            display: 'block',
                            color: '#FFE330',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            marginBottom: '4px'
                          }}>
                            Time
                          </span>
                          <span style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: '600'
                          }}>
                            {formattedTime}
                          </span>
                        </div>
                      </div>

                      <p style={{
                        color: '#a0a0a0',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        borderTop: '1px solid #404040',
                        paddingTop: '20px',
                        margin: '0'
                      }}>
                        You&apos;ll receive a reminder before the event starts.<br />
                        <span style={{ color: '#707070' }}>Stay tuned!</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

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
