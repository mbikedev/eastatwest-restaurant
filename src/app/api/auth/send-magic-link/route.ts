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

    // Create admin client to generate magic link
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Generate magic link
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: redirectTo || `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin`
      }
    })

    if (error) {
      console.error('Error generating magic link:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to generate magic link' },
        { status: 500 }
      )
    }

    const magicLink = data.properties.action_link

    // Send email with magic link
    const emailResult = await sendEmail({
      to: email,
      subject: 'Your Magic Link - East at West Admin',
      text: `Your Magic Link - East at West Admin

Click the link below to securely sign in to your East at West admin account:
${magicLink}

This link will expire in 1 hour for security reasons.

Only use it if you requested to sign in. If you didn't request this, please ignore this email.

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
              <h2 style="color: #374151; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">🔐 Your Magic Link</h2>

              <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px; line-height: 1.6;">
                Click the button below to securely sign in to your East at West admin account. No password required!
              </p>

              <!-- Magic Link Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" style="display: inline-block; background-color: #8BC5A8; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(139, 197, 168, 0.3);">
                  Sign In to Admin
                </a>
              </div>

              <p style="color: #6b7280; margin: 20px 0; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="color: #3b82f6; margin: 0 0 30px 0; font-size: 14px; word-break: break-all;">
                ${magicLink}
              </p>

              <!-- Security Notice -->
              <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; border-left: 4px solid: #10b981; margin: 30px 0;">
                <h4 style="color: #065f46; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">🔒 Security Notice</h4>
                <p style="color: #065f46; margin: 0; font-size: 14px; line-height: 1.6;">
                  This link will expire in 1 hour for security reasons. Only use it if you requested to sign in. If you didn't request this, please ignore this email.
                </p>
              </div>

              <p style="color: #9ca3af; margin: 30px 0 0 0; font-size: 14px;">
                This is an automated message. Please do not reply to this email.
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
      message: 'Magic link sent successfully'
    })

  } catch (error) {
    console.error('Error in magic link API:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
