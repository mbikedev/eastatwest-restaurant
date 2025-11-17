/**
 * Test sending email directly via Resend API (bypassing Supabase)
 * This confirms Resend is working independently
 *
 * Usage: npm run test:resend-direct
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'contact@eastatwest.com'

async function sendTestEmail() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Testing Direct Email Send via Resend API')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local')
    process.exit(1)
  }

  const testEmail = 'mbagnickg@gmail.com'

  console.log('From:', RESEND_FROM_EMAIL)
  console.log('To:', testEmail)
  console.log('Subject: Test Email from Resend')
  console.log('')
  console.log('Sending email...')
  console.log('')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `East at West Restaurant <${RESEND_FROM_EMAIL}>`,
        to: [testEmail],
        subject: 'Test Email from Resend API',
        html: `
          <h2>Test Email</h2>
          <p>This is a test email sent directly via Resend API (bypassing Supabase).</p>
          <p>If you receive this, it means:</p>
          <ul>
            <li>✅ Resend API key is working</li>
            <li>✅ Domain ${RESEND_FROM_EMAIL.split('@')[1]} is verified</li>
            <li>✅ Email delivery is functional</li>
          </ul>
          <p>The issue is likely with the Supabase SMTP configuration.</p>
          <hr>
          <p><small>Sent from: East at West Restaurant testing script</small></p>
        `,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('❌ Email Send FAILED')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
      console.log('Status:', response.status)
      console.log('Error:', JSON.stringify(data, null, 2))
      console.log('')

      if (response.status === 422 && data.message?.includes('domain')) {
        console.log('Domain Verification Issue:')
        console.log('  • The from email domain is not verified')
        console.log('  • Go to: https://resend.com/domains')
        console.log('  • Verify domain or use: onboarding@resend.dev')
      } else if (response.status === 401) {
        console.log('Authentication Issue:')
        console.log('  • API key is invalid or expired')
        console.log('  • Go to: https://resend.com/api-keys')
        console.log('  • Generate a new API key')
      } else {
        console.log('Check Resend documentation:')
        console.log('  https://resend.com/docs/api-reference/emails/send-email')
      }

      console.log('')
      process.exit(1)
    }

    console.log('✅ Email Sent Successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Email Details:')
    console.log('  Email ID:', data.id)
    console.log('  From:', RESEND_FROM_EMAIL)
    console.log('  To:', testEmail)
    console.log('')
    console.log('📬 Check your inbox!')
    console.log('')
    console.log('View in Resend Dashboard:')
    console.log('  https://resend.com/emails/' + data.id)
    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('✅ Resend is working correctly!')
    console.log('')
    console.log('Since Resend works but Supabase SMTP fails, the issue is:')
    console.log('  • SMTP configuration in Supabase dashboard')
    console.log('  • Check Supabase Auth logs for detailed error')
    console.log('  • Verify all SMTP settings are exactly correct')
    console.log('')
    console.log('Possible issues:')
    console.log('  1. SMTP not fully enabled (toggle might not be ON)')
    console.log('  2. Port might be saved incorrectly')
    console.log('  3. Hidden characters in username/password fields')
    console.log('  4. Supabase cache not refreshed (wait 60 seconds)')
    console.log('')

  } catch (error: any) {
    console.log('❌ Network Error')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Error:', error.message)
    console.log('')
    console.log('Please check your internet connection.')
    console.log('')
    process.exit(1)
  }
}

sendTestEmail().catch(error => {
  console.error('\n❌ Unexpected error:', error)
  process.exit(1)
})
