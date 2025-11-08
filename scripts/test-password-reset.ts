/**
 * Quick test script for password reset email
 *
 * Usage: npm run test:password-reset
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function testPasswordReset() {
  // Use the first admin email from your whitelist
  const testEmail = 'mbagnickg@gmail.com'

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Testing Password Reset Email')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Configuration:')
  console.log('  Supabase URL:', SUPABASE_URL)
  console.log('  Test Email:', testEmail)
  console.log('  From Email:', process.env.RESEND_FROM_EMAIL || 'Not set')
  console.log('  Resend API Key:', process.env.RESEND_API_KEY ? '✓ Set' : '❌ Not set')
  console.log('')
  console.log('🔄 Sending password reset email...')
  console.log('')

  const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`
  })

  if (error) {
    console.error('❌ Error sending password reset:')
    console.error('   Message:', error.message)
    console.error('   Status:', error.status)
    console.error('')
    console.log('💡 Troubleshooting:')
    console.log('   1. Check SMTP settings in Supabase Dashboard')
    console.log('   2. Go to: Authentication → Configuration → SMTP Settings')
    console.log('   3. Verify Resend credentials are correct')
    console.log('   4. Check Supabase logs: Logs → Auth Logs')
    console.log('')
    process.exit(1)
  }

  console.log('✅ Password reset email sent successfully!')
  console.log('')
  console.log('📬 Next Steps:')
  console.log('   1. Check inbox:', testEmail)
  console.log('   2. Check spam/junk folder if not in inbox')
  console.log('   3. Verify Resend dashboard: https://resend.com/emails')
  console.log('   4. Check Supabase logs for delivery status')
  console.log('')
  console.log('Expected Sender: East at West Restaurant <contact@eastatwest.com>')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
}

testPasswordReset().catch(error => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})
