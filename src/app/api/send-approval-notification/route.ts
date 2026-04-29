import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { reservationData, action } = await req.json();

    if (!reservationData || !action) {
      return NextResponse.json(
        { success: false, error: 'Missing reservation data or action' },
        { status: 400 }
      );
    }

    // Check SMTP configuration
    const smtpConfigured = process.env.SMTP_HOST &&
                          process.env.SMTP_PORT &&
                          process.env.SMTP_USER &&
                          process.env.SMTP_PASS;

    if (!smtpConfigured) {
      console.error('SMTP configuration is incomplete');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // The staff email addresses to notify
    const notificationEmails = [
      'contact@eastatwest.com',
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com'
    ];

    const isApproved = action === 'approved';
    const actionText = isApproved ? 'APPROVED' : 'REJECTED';
    const subject = `Reservation ${actionText} – East At West`;
    const statusColor = isApproved ? '#10b981' : '#ef4444';
    const statusBg = isApproved ? '#dcfce7' : '#fee2e2';

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reservation ${actionText}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">East At West</h1>
            <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Restaurant & Take-Away</p>
          </div>

          <!-- Status Banner -->
          <div style="background-color: ${statusColor}; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              RESERVATION ${actionText}
            </h2>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Reservation Details</h3>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Name</p>
                  <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.name}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Email</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;"><a href="mailto:${reservationData.email}" style="color: #374151; text-decoration: none;">${reservationData.email}</a></p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Phone</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;"><a href="tel:${reservationData.phone}" style="color: #374151; text-decoration: none;">${reservationData.phone}</a></p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Date</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;">${new Date(reservationData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Time</p>
                  <p style="color: #374151; margin: 0; font-size: 16px;">${reservationData.start_time} - ${reservationData.end_time}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Number of People</p>
                  <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
            </div>

            ${reservationData.special_requests ? `
            <!-- Special Requests -->
            <div style="margin-bottom: 30px;">
              <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Special Requests</h4>
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">${reservationData.special_requests}</p>
              </div>
            </div>
            ` : ''}

            <!-- Status Update -->
            <div style="background-color: ${statusBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin-bottom: 30px;">
              <h4 style="color: ${statusColor}; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Status Update</h4>
              <p style="color: ${statusColor}; margin: 0; font-size: 14px; line-height: 1.6;">
                ${isApproved ? 
                  'This reservation has been APPROVED and confirmed. The customer will be notified automatically.' :
                  'This reservation has been REJECTED/CANCELLED. The customer will be notified with the cancellation details.'
                }
              </p>
            </div>

            <!-- Staff Information -->
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
              <h4 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">${isApproved ? 'Preparation Notes' : 'Next Steps'}</h4>
              <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                ${isApproved ? `
                  <li>Prepare table arrangement for ${reservationData.guests} guests</li>
                  <li>Note any special requests: ${reservationData.special_requests || 'None'}</li>
                  <li>Confirm table setup before the reservation date</li>
                  <li>Customer contact: <a href="tel:${reservationData.phone}" style="color: #3b82f6;">${reservationData.phone}</a></li>
                ` : `
                  <li>Reservation has been cancelled in the system</li>
                  <li>Customer will receive automatic cancellation notification</li>
                  <li>Table capacity has been freed for the time slot</li>
                  <li>No further action required unless customer contacts directly</li>
                `}
              </ul>
            </div>

            <!-- Timestamp -->
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; margin: 0; font-size: 12px; text-align: center;">
                Action performed on ${new Date().toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric'
                })} at ${new Date().toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #d1d5db; margin: 0; font-size: 14px;">
              East At West Restaurant Management System
            </p>
            <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
              Bld de l'Empereur 26, 1000 Brussels, Belgium
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Reservation ${actionText} – East At West

Hello,

A reservation has been ${actionText.toLowerCase()} in the admin system.

Reservation Details:
Name: ${reservationData.name}
Phone: ${reservationData.phone}
Email: ${reservationData.email}
Date: ${new Date(reservationData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
Time: ${reservationData.start_time} - ${reservationData.end_time}
Number of People: ${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}
${reservationData.special_requests ? `Special Requests: ${reservationData.special_requests}` : ''}

Status: ${actionText}

${isApproved ? 
  'The customer will receive automatic confirmation. Please prepare for this reservation.' :
  'The customer will receive automatic cancellation notification. No further action required.'
}

Action performed on ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}

East At West Restaurant
Bld de l'Empereur 26, 1000 Brussels, Belgium
`;

    // Send emails to all notification addresses
    const emailPromises = notificationEmails.map(email =>
      sendEmail({
        to: email,
        subject,
        text: emailText,
        html: emailHTML,
        headers: {}
      })
    );

    // Wait for all emails to be sent
    const results = await Promise.allSettled(emailPromises);
    
    // Log results
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        console.log(`${actionText} notification email sent successfully to ${notificationEmails[index]}:`, result.value);
      } else {
        console.error(`Failed to send ${actionText} notification email to ${notificationEmails[index]}:`, result.reason);
      }
    });

    // Return success if at least one email was sent
    const successCount = results.filter(result => result.status === 'fulfilled').length;
    
    if (successCount > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `${actionText} notification emails sent to ${successCount}/${notificationEmails.length} addresses`
      });
    } else {
      return NextResponse.json(
        { success: false, error: `Failed to send ${actionText} notification emails` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error sending approval notification emails:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
