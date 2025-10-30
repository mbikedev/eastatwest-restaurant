/**
 * Test script to verify Supabase Auth email sending with Resend SMTP
 *
 * This script helps test:
 * 1. Password reset emails
 * 2. Magic link emails
 * 3. Email verification
 *
 * Usage:
 *   npx ts-node scripts/test-email.ts
 *
 * Or add to package.json:
 *   "test:email": "ts-node scripts/test-email.ts"
 */

import { createClient } from '@supabase/supabase-js'
import * as readline from 'readline'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables!')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve))
}

async function testPasswordReset(email: string) {
  console.log('\n🔄 Testing password reset email...')

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`
  })

  if (error) {
    console.error('❌ Error sending password reset:', error.message)
    return false
  }

  console.log('✅ Password reset email sent successfully!')
  console.log('📧 Check your inbox:', email)
  return true
}

async function testMagicLink(email: string) {
  console.log('\n🔄 Testing magic link email...')

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin`
    }
  })

  if (error) {
    console.error('❌ Error sending magic link:', error.message)
    return false
  }

  console.log('✅ Magic link email sent successfully!')
  console.log('📧 Check your inbox:', email)
  return true
}

async function createTestUser(email: string) {
  console.log('\n🔄 Creating test user (will send confirmation email)...')

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: false, // This will trigger a confirmation email
    user_metadata: {
      test_user: true,
      created_at: new Date().toISOString()
    }
  })

  if (error) {
    console.error('❌ Error creating user:', error.message)
    return false
  }

  console.log('✅ Test user created successfully!')
  console.log('📧 Confirmation email sent to:', email)
  console.log('👤 User ID:', data.user.id)
  return true
}

async function checkEmailSettings() {
  console.log('\n🔍 Checking email configuration...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Environment Variables:')
  console.log('✓ SUPABASE_URL:', SUPABASE_URL)
  console.log('✓ RESEND_API_KEY:', process.env.RESEND_API_KEY ? '✓ Set' : '❌ Not set')
  console.log('✓ RESEND_FROM_EMAIL:', process.env.RESEND_FROM_EMAIL || '❌ Not set')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n⚠️  Note: SMTP must be configured in Supabase Dashboard')
  console.log('Go to: Authentication → Configuration → SMTP Settings')
  console.log('')
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Supabase Auth Email Testing Tool')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  await checkEmailSettings()

  console.log('\nSelect test type:')
  console.log('1. Test Password Reset Email')
  console.log('2. Test Magic Link Email')
  console.log('3. Create Test User (sends confirmation email)')
  console.log('4. Run All Tests')
  console.log('5. Exit')

  const choice = await question('\nEnter your choice (1-5): ')

  if (choice === '5') {
    console.log('\n👋 Goodbye!')
    rl.close()
    return
  }

  const email = await question('\n📧 Enter email address to test: ')

  if (!email || !email.includes('@')) {
    console.error('❌ Invalid email address')
    rl.close()
    return
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  switch (choice) {
    case '1':
      await testPasswordReset(email)
      break
    case '2':
      await testMagicLink(email)
      break
    case '3':
      await createTestUser(email)
      break
    case '4':
      await testPasswordReset(email)
      await new Promise(resolve => setTimeout(resolve, 2000))
      await testMagicLink(email)
      break
    default:
      console.error('❌ Invalid choice')
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('\n💡 Tips:')
  console.log('• Check spam/junk folder if email not received')
  console.log('• Check Supabase logs: Dashboard → Logs → Auth Logs')
  console.log('• Check Resend dashboard: https://resend.com/emails')
  console.log('• Verify SMTP settings in Supabase Dashboard')
  console.log('')

  rl.close()
}

main().catch(error => {
  console.error('❌ Unexpected error:', error)
  rl.close()
  process.exit(1)
})
