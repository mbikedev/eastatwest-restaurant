import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA token is required' },
        { status: 400 }
      )
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY is not configured')
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA is not configured on the server' },
        { status: 500 }
      )
    }

    // Verify the token with Google
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`

    const response = await fetch(verificationUrl, {
      method: 'POST',
    })

    const data = await response.json()

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    // We'll accept scores above 0.5
    if (data.success && data.score >= 0.5) {
      return NextResponse.json({
        success: true,
        score: data.score,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'reCAPTCHA verification failed',
        score: data.score,
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify reCAPTCHA' },
      { status: 500 }
    )
  }
}
