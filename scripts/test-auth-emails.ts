/**
 * Test custom auth email APIs (Password Reset & Magic Link)
 * Usage: npm run test:auth-emails
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
const TEST_EMAIL = 'mbagnickg@gmail.com'

async function testPasswordReset() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔑 Testing Password Reset Email')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Test Email:', TEST_EMAIL)
  console.log('API Endpoint:', `${BASE_URL}/api/auth/send-password-reset`)
  console.log('')
  console.log('Sending request...')
  console.log('')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/send-password-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        redirectTo: `${BASE_URL}/reset-password`,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      console.log('❌ Password Reset Test FAILED')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
      console.log('Status:', response.status)
      console.log('Error:', data.error || 'Unknown error')
      console.log('')
      return false
    }

    console.log('✅ Password Reset Email Sent Successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Email ID:', data.emailId)
    console.log('Message:', data.message)
    console.log('')
    console.log('📬 Check your inbox:', TEST_EMAIL)
    console.log('📧 View in Resend:', `https://resend.com/emails/${data.emailId}`)
    console.log('')
    return true

  } catch (error: any) {
    console.log('❌ Network Error')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Error:', error.message)
    console.log('')
    return false
  }
}

async function testMagicLink() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🪄 Testing Magic Link Email')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Test Email:', TEST_EMAIL)
  console.log('API Endpoint:', `${BASE_URL}/api/auth/send-magic-link`)
  console.log('')
  console.log('Sending request...')
  console.log('')

  try {
    const response = await fetch(`${BASE_URL}/api/auth/send-magic-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: TEST_EMAIL,
        redirectTo: `${BASE_URL}/admin`,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.success) {
      console.log('❌ Magic Link Test FAILED')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
      console.log('Status:', response.status)
      console.log('Error:', data.error || 'Unknown error')
      console.log('')
      return false
    }

    console.log('✅ Magic Link Email Sent Successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Email ID:', data.emailId)
    console.log('Message:', data.message)
    console.log('')
    console.log('📬 Check your inbox:', TEST_EMAIL)
    console.log('📧 View in Resend:', `https://resend.com/emails/${data.emailId}`)
    console.log('')
    return true

  } catch (error: any) {
    console.log('❌ Network Error')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Error:', error.message)
    console.log('')
    return false
  }
}

async function main() {
  console.log('')
  console.log('╔═══════════════════════════════════════════╗')
  console.log('║  Custom Auth Email Testing Suite         ║')
  console.log('╚═══════════════════════════════════════════╝')
  console.log('')
  console.log('Testing custom auth email implementation')
  console.log('Using Resend SDK (bypassing Supabase SMTP)')
  console.log('')

  // Check if dev server is running
  console.log('ℹ️  Note: Dev server must be running at', BASE_URL)
  console.log('   Run: npm run dev')
  console.log('')

  const results = {
    passwordReset: false,
    magicLink: false,
  }

  // Test Password Reset
  results.passwordReset = await testPasswordReset()

  // Wait a bit between tests
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Test Magic Link
  results.magicLink = await testMagicLink()

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Test Summary')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Password Reset:', results.passwordReset ? '✅ PASSED' : '❌ FAILED')
  console.log('Magic Link:    ', results.magicLink ? '✅ PASSED' : '❌ FAILED')
  console.log('')

  const allPassed = results.passwordReset && results.magicLink

  if (allPassed) {
    console.log('🎉 All Tests Passed!')
    console.log('')
    console.log('✅ Custom auth emails are working correctly')
    console.log('✅ Bypassing Supabase SMTP successfully')
    console.log('✅ Using Resend SDK directly')
    console.log('')
    console.log('Next steps:')
    console.log('  • Test in production after deployment')
    console.log('  • Check emails arrive in inbox')
    console.log('  • Verify links work correctly')
    console.log('  • Monitor Resend dashboard for delivery')
    console.log('')
  } else {
    console.log('⚠️  Some Tests Failed')
    console.log('')
    console.log('Troubleshooting:')
    console.log('  • Ensure dev server is running (npm run dev)')
    console.log('  • Check environment variables in .env.local')
    console.log('  • Verify Resend API key is valid')
    console.log('  • Check server logs for errors')
    console.log('')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
}

main().catch(error => {
  console.error('\n❌ Unexpected error:', error)
  process.exit(1)
})
