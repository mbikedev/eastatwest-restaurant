import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    console.log('📧 Comment notification email API called');

    const { commentData } = await req.json();

    if (!commentData) {
      console.error('❌ Missing comment data');
      return NextResponse.json(
        { success: false, error: 'Missing comment data' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.error('❌ SMTP configuration is not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured - SMTP missing' },
        { status: 500 }
      );
    }

    console.log('✅ SendGrid API key found, initializing...');

    // Admin email addresses to notify
    const notificationEmails = [
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    ];

    console.log('📬 Will send comment notifications to:', notificationEmails);

    const blogPostUrl = commentData.blog_post_slug
      ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com'}/blog/${commentData.blog_post_slug}`
      : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com'}/blog`;

    const adminPanelUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://eastatwest.com'}/admin/comments`;

    const subject = `New Blog Comment Awaiting Approval – East At West`;

    const emailHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Comment</title>
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
          <div style="background-color: #3b82f6; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">💬 New Comment Received</h2>
            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Awaiting Your Approval</p>
          </div>

          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #111827; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              A new comment has been submitted on your blog and is waiting for approval.
            </p>

            <!-- Comment Details -->
            <div style="background-color: #f9fafb; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151; font-size: 14px;">Blog Post:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="color: #111827; font-size: 14px;">${commentData.blog_post_title || 'Unknown Post'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151; font-size: 14px;">Author Name:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <span style="color: #111827; font-size: 14px;">${commentData.author_name}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151; font-size: 14px;">Author Email:</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <a href="mailto:${commentData.author_email}" style="color: #3b82f6; font-size: 14px; text-decoration: none;">${commentData.author_email}</a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Comment Content -->
            <div style="background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #374151; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">Comment:</h3>
              <p style="color: #111827; font-size: 15px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${commentData.content}</p>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${adminPanelUrl}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 8px 10px 8px;">
                Manage Comments
              </a>
              <a href="${blogPostUrl}" style="display: inline-block; background-color: #6b7280; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin: 0 8px 10px 8px;">
                View Blog Post
              </a>
            </div>

            <!-- Divider -->
            <div style="border-top: 1px solid #e5e7eb; margin: 30px 0;"></div>

            <!-- Footer Info -->
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
              <strong>What to do next:</strong><br>
              1. Review the comment in the admin panel<br>
              2. Approve or reject the comment<br>
              3. Optionally reply to the commenter
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
              <strong>East At West</strong><br>
              Rue Lesbroussart 77, 1050 Ixelles, Brussels<br>
              Phone: <a href="tel:+3225121234" style="color: #3b82f6; text-decoration: none;">+32 2 512 1234</a><br>
              Email: <a href="mailto:contact@eastatwest.com" style="color: #3b82f6; text-decoration: none;">contact@eastatwest.com</a>
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">
              This is an automated notification from your website's comment system.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to all admin addresses
    const emailPromises = notificationEmails.map(async (email) => {
      try {
        console.log(`📤 Sending comment notification to ${email}...`);
        const result = await sendEmail({
          to: email,
          subject: subject,
          text: 'New Blog Comment',
          html: emailHTML,
        });
        console.log(`✅ Email sent successfully to ${email}:`, result);
        return { email, success: true, result };
      } catch (error) {
        console.error(`❌ Failed to send email to ${email}:`, error);
        return {
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    });

    const results = await Promise.all(emailPromises);
    console.log('📊 All email results:', results);

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    if (failureCount === results.length) {
      // All emails failed
      console.error('❌ All comment notification emails failed');
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send all notification emails',
          debug: {
            results,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

    // At least some emails succeeded
    console.log(`✅ Comment notifications sent: ${successCount} succeeded, ${failureCount} failed`);
    return NextResponse.json({
      success: true,
      message: `Comment notification emails sent (${successCount}/${results.length} succeeded)`,
      debug: {
        successCount,
        failureCount,
        results,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in comment notification API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}
