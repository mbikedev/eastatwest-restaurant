import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Notification email API called');
    console.log('📍 Environment:', process.env.NODE_ENV);
    console.log('🔑 SMTP_HOST exists:', !!process.env.SMTP_HOST);
    console.log('📧 SMTP_USER:', process.env.SMTP_USER || 'NOT SET');

    const { reservationData } = await req.json();

    if (!reservationData) {
      console.error('❌ Missing reservation data');
      return NextResponse.json(
        {
          success: false,
          error: 'Missing reservation data',
          debug: {
            receivedData: req.body,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    console.log('✅ Reservation data received:', reservationData);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('❌ SMTP configuration is incomplete');
      console.error('💡 Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables');
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured - SMTP settings missing',
          debug: {
            environment: process.env.NODE_ENV,
            hasHost: !!process.env.SMTP_HOST,
            hasUser: !!process.env.SMTP_USER,
            hasPass: !!process.env.SMTP_PASS,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

    console.log('✅ SMTP configuration found, sending emails...');

    // The three email addresses to notify
    const notificationEmails = [
      'contact@eastatwest.com',
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com'
    ];

    console.log('📬 Will send notifications to:', notificationEmails);

    const subject = 'New Reservation Received – East At West';

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Reservation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com'}/images/east-logo.webp" alt="East At West Logo" style="max-width: 180px; height: auto; margin-bottom: 15px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">East At West</h1>
            <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Restaurant & Take-Away</p>
          </div>

          <!-- Status Banner -->
          <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
              NEW RESERVATION RECEIVED
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
                  <p style="color: #374151; margin: 0; font-size: 16px;">${reservationData.startTime} - ${reservationData.endTime}</p>
                </div>
                
                <div>
                  <p style="color: #6b7280; margin: 0 0 5px 0; font-size: 14px; font-weight: 500; text-transform: uppercase;">Number of People</p>
                  <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 600;">${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}</p>
                </div>
              </div>
            </div>

            ${reservationData.specialRequests ? `
            <!-- Special Requests -->
            <div style="margin-bottom: 30px;">
              <h4 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Special Requests</h4>
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.6;">${reservationData.specialRequests}</p>
              </div>
            </div>
            ` : ''}

            <!-- Action Required -->
            <div style="background-color: ${reservationData.guests >= 7 ? '#fef3c7' : '#dcfce7'}; padding: 20px; border-radius: 8px; border-left: 4px solid ${reservationData.guests >= 7 ? '#f59e0b' : '#10b981'}; margin-bottom: 30px;">
              <h4 style="color: ${reservationData.guests >= 7 ? '#92400e' : '#065f46'}; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Status</h4>
              <p style="color: ${reservationData.guests >= 7 ? '#92400e' : '#065f46'}; margin: 0; font-size: 14px; line-height: 1.6;">
                ${reservationData.guests >= 7 ? 
                  'This reservation requires approval (7+ guests). Please check the reservation system and contact the client if needed.' :
                  'This reservation has been automatically confirmed. No action required unless there are conflicts.'
                }
              </p>
            </div>

            <!-- Action Instructions -->
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
              <h4 style="color: #334155; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">Next Steps</h4>
              <ul style="color: #475569; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6;">
                <li>Check the reservation system for any conflicts</li>
                <li>Contact the client if needed: <a href="tel:${reservationData.phone}" style="color: #3b82f6;">${reservationData.phone}</a></li>
                <li>Send confirmation or update the reservation status in the admin panel</li>
                ${reservationData.guests >= 7 ? '<li style="font-weight: 600; color: #dc2626;">Approval required for this large group reservation</li>' : ''}
              </ul>
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
New Reservation Received – East At West

Hello,

A new reservation has been submitted through the website. Here are the details:

Name: ${reservationData.name}
Phone: ${reservationData.phone}
Email: ${reservationData.email}
Date: ${new Date(reservationData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })}
Time: ${reservationData.startTime} - ${reservationData.endTime}
Number of People: ${reservationData.guests} ${reservationData.guests === 1 ? 'person' : 'people'}
${reservationData.specialRequests ? `Special Requests: ${reservationData.specialRequests}` : ''}

${reservationData.guests >= 7 ? 
  'APPROVAL REQUIRED: This reservation requires approval (7+ guests). Please check the reservation system and contact the client if needed.' :
  'STATUS: This reservation has been automatically confirmed.'
}

Please check the reservation system or contact the client if needed.

East At West Restaurant
Bld de l'Empereur 26, 1000 Brussels, Belgium
`;

    // Send emails one at a time with delays to avoid rate limiting
    // Resend free tier: 2 requests per second
    console.log('📤 Sending emails with rate limiting...');
    const results: Array<{ email: string; success: boolean; result?: any; error?: any }> = [];

    for (let i = 0; i < notificationEmails.length; i++) {
      const email = notificationEmails[i];
      console.log(`  → Sending email ${i + 1}/${notificationEmails.length} to ${email}`);

      try {
        const result = await sendEmail({
          to: email,
          subject,
          text: emailText,
          html: emailHTML,
          headers: {}
        });

        console.log(`✅ Successfully sent to ${email}`);
        results.push({ email, success: true, result });
      } catch (error) {
        console.error(`❌ Exception sending to ${email}:`, error);
        results.push({ email, success: false, error });
      }

      // Add delay between emails to respect rate limit (600ms = ~1.6 requests/sec)
      if (i < notificationEmails.length - 1) {
        console.log('  ⏳ Waiting 600ms to respect rate limit...');
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }

    // Log results
    console.log('📊 Email delivery results:');
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    results.forEach(r => {
      if (r.success) {
        console.log(`✅ ${r.email}: Sent successfully`);
      } else {
        console.error(`❌ ${r.email}: Failed -`, r.error);
      }
    });

    console.log(`📈 Summary: ${successCount} succeeded, ${failureCount} failed`);

    if (successCount > 0) {
      console.log('✅ Notification email API completed successfully');
      return NextResponse.json({
        success: true,
        message: `Notification emails sent to ${successCount}/${notificationEmails.length} addresses`,
        details: {
          total: notificationEmails.length,
          succeeded: successCount,
          failed: failureCount
        }
      });
    } else {
      console.error('❌ All notification emails failed to send');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send notification emails to any recipient',
          details: {
            total: notificationEmails.length,
            succeeded: 0,
            failed: failureCount
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('❌ Critical error in notification email API:', error);
    console.error('🔍 Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          errorType: error instanceof Error ? error.name : typeof error,
          environment: process.env.NODE_ENV,
          hasSmtpHost: !!process.env.SMTP_HOST,
          hasSmtpUser: !!process.env.SMTP_USER,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
} 