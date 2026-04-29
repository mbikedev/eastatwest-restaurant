import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const { email, redirectTo } = await req.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Create admin client to generate reset token
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Generate password reset token
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`
      }
    })

    if (error) {
      console.error('Error generating reset link:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to generate reset link' },
        { status: 500 }
      )
    }

    const resetLink = data.properties.action_link

    // Send email with reset link
    const emailResult = await sendEmail({
      to: email,
      subject: 'Reset Your Password - East at West',
      text: `Reset Your Password - East at West

You requested to reset your password for your East at West account.

Click the link below to create a new password:
${resetLink}

This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email or contact us if you have concerns.

East at West Restaurant
Bld de l'Empereur 26, 1000 Brussels, Belgium`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300;">East at West</h1>
              <p style="color: #d1d5db; margin: 10px 0 0 0; font-size: 16px;">Restaurant & Take-Away</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Reset Your Password</h2>

              <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                You requested to reset your password for your East at West account. Click the button below to create a new password.
              </p>

              <!-- Reset Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetLink}" style="display: inline-block; background-color: #A8D5BA; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(168, 213, 186, 0.3);">
                  Reset Password
                </a>
              </div>

              <p style="color: #6b7280; margin: 20px 0; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; margin: 0 0 30px 0; font-size: 14px; word-break: break-all;">
                ${resetLink}
              </p>

              <!-- Security Notice -->
              <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 30px 0;">
                <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Security Notice</h4>
                <p style="color: #92400e; margin: 0; font-size: 14px; line-height: 1.6;">
                  This link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email or contact us if you have concerns.
                </p>
              </div>

              <p style="color: #9ca3af; margin: 30px 0 0 0; font-size: 14px;">
                If you're having trouble clicking the button, copy and paste the URL into your web browser.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #1f2937; padding: 20px; text-align: center;">
              <p style="color: #d1d5db; margin: 0; font-size: 14px;">
                East at West Restaurant
              </p>
              <p style="color: #9ca3af; margin: 10px 0 0 0; font-size: 12px;">
                Bld de l'Empereur 26, 1000 Brussels, Belgium
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    })

  } catch (error) {
    console.error('Error in password reset API:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
