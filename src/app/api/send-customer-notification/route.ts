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

    const isApproved = action === 'approved';
    const actionText = isApproved ? 'CONFIRMED' : 'CANCELLED';
    const subject = `Your Reservation at East At West is ${actionText}`;
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
            <p style="color: #374151; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
              Dear ${reservationData.name},
            </p>

            <p style="color: #374151; margin: 0 0 30px 0; font-size: 16px; line-height: 1.6;">
              ${isApproved ?
                'Great news! Your reservation at East At West has been <strong style="color: #10b981;">confirmed</strong>. We look forward to welcoming you!' :
                'We regret to inform you that your reservation at East At West has been <strong style="color: #ef4444;">cancelled</strong>. We apologize for any inconvenience.'
              }
            </p>

            <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">Reservation Details</h3>

            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <div style="margin-bottom: 15px;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Date</p>
                <p style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">${new Date(reservationData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}</p>
              </div>

              <div style="margin-bottom: 15px;">
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Time</p>
                <p style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">${reservationData.start_time} - ${reservationData.end_time}</p>
              </div>

              <div>
                <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Number of Guests</p>
                <p style="color: #374151; margin: 0; font-size: 18px; font-weight: 600;">${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}</p>
              </div>
            </div>

            ${reservationData.special_requests ? `
            <div style="margin-bottom: 30px;">
              <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your Special Requests</h4>
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">${reservationData.special_requests}</p>
              </div>
            </div>
            ` : ''}

            ${isApproved ? `
            <!-- Confirmation Info -->
            <div style="background-color: ${statusBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin-bottom: 30px;">
              <h4 style="color: ${statusColor}; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Important Information</h4>
              <ul style="color: #065f46; margin: 10px 0 0 0; padding-left: 20px; font-size: 14px; line-height: 1.8;">
                <li>Please arrive on time for your reservation</li>
                <li>If you need to cancel or modify, please contact us at least 24 hours in advance</li>
                <li>Reservation ID: ${reservationData.id}</li>
              </ul>
            </div>

            <!-- Contact -->
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #334155; margin: 0 0 10px 0; font-size: 14px;">Need to make changes?</p>
              <p style="color: #475569; margin: 0; font-size: 14px;">
                Contact us at <a href="tel:+3225083838" style="color: #3b82f6; text-decoration: none;">+32 2 508 38 38</a><br>
                or email <a href="mailto:contact@eastatwest.com" style="color: #3b82f6; text-decoration: none;">contact@eastatwest.com</a>
              </p>
            </div>
            ` : `
            <!-- Cancellation Info -->
            <div style="background-color: ${statusBg}; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColor}; margin-bottom: 30px;">
              <h4 style="color: ${statusColor}; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">What's Next?</h4>
              <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.6;">
                If you'd like to make a new reservation, please visit our website or contact us directly. We'd be happy to help you find an alternative date and time.
              </p>
            </div>

            <!-- Contact -->
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center;">
              <p style="color: #334155; margin: 0 0 10px 0; font-size: 14px;">Questions or concerns?</p>
              <p style="color: #475569; margin: 0; font-size: 14px;">
                Contact us at <a href="tel:+3225083838" style="color: #3b82f6; text-decoration: none;">+32 2 508 38 38</a><br>
                or email <a href="mailto:contact@eastatwest.com" style="color: #3b82f6; text-decoration: none;">contact@eastatwest.com</a>
              </p>
            </div>
            `}

            <p style="color: #374151; margin: 30px 0 0 0; font-size: 16px; line-height: 1.6;">
              ${isApproved ?
                'We look forward to serving you!' :
                'We apologize for any inconvenience and hope to see you soon.'
              }<br><br>
              <strong>East At West Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #d1d5db; margin: 0; font-size: 14px;">
              East At West
            </p>
            <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
              Bld de l'Empereur 26, 1000 Brussels, Belgium<br>
              Tel: +32 2 508 38 38 | Email: contact@eastatwest.com
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailText = `
Your Reservation at East At West is ${actionText}

Dear ${reservationData.name},

${isApproved ?
  'Great news! Your reservation at East At West has been CONFIRMED. We look forward to welcoming you!' :
  'We regret to inform you that your reservation at East At West has been CANCELLED. We apologize for any inconvenience.'
}

Reservation Details:
Date: ${new Date(reservationData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
Time: ${reservationData.start_time} - ${reservationData.end_time}
Number of Guests: ${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}
${reservationData.special_requests ? `Special Requests: ${reservationData.special_requests}` : ''}

${isApproved ?
  `Important Information:
- Please arrive on time for your reservation
- If you need to cancel or modify, please contact us at least 24 hours in advance
- Reservation ID: ${reservationData.id}

Need to make changes?
Contact us at +32 2 508 38 38 or email contact@eastatwest.com` :
  `What's Next?
If you'd like to make a new reservation, please visit our website or contact us directly. We'd be happy to help you find an alternative date and time.

Questions or concerns?
Contact us at +32 2 508 38 38 or email contact@eastatwest.com`
}

${isApproved ? 'We look forward to serving you!' : 'We apologize for any inconvenience and hope to see you soon.'}

East At West Team
Bld de l'Empereur 26, 1000 Brussels, Belgium
Tel: +32 2 508 38 38 | Email: contact@eastatwest.com
`;

    // Send email to the customer
    const result = await sendEmail({
      from: process.env.SMTP_FROM_EMAIL || 'contact@eastatwest.com',
      to: reservationData.email,
      subject,
      text: emailText,
      html: emailHTML,
      headers: {
        'X-Mailer': 'East At West Restaurant'
      }
    });

    console.log(`Customer ${actionText} notification email sent to ${reservationData.email}:`, result);

    return NextResponse.json({
      success: true,
      message: `Customer ${actionText} notification email sent successfully`
    });

  } catch (error) {
    console.error('Error sending customer notification email:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
