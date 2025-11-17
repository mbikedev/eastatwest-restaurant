/**
 * Diagnostic script to check Supabase SMTP configuration
 * Usage: npm run diagnose:smtp
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL

async function runDiagnostics() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔍 Supabase SMTP Diagnostic Tool')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  // Step 1: Check Environment Variables
  console.log('📋 Step 1: Checking Environment Variables')
  console.log('─────────────────────────────────────────────────')

  const checks = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: SUPABASE_URL, required: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: SUPABASE_ANON_KEY, required: true },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', value: SUPABASE_SERVICE_KEY, required: true },
    { name: 'RESEND_API_KEY', value: RESEND_API_KEY, required: false },
    { name: 'RESEND_FROM_EMAIL', value: RESEND_FROM_EMAIL, required: false },
  ]

  let hasRequiredVars = true

  checks.forEach(check => {
    const status = check.value
      ? '✅'
      : check.required
        ? '❌ MISSING'
        : '⚠️  Not set (optional)'

    const displayValue = check.value
      ? check.name.includes('KEY')
        ? check.value.substring(0, 20) + '...'
        : check.value
      : 'Not set'

    console.log(`${status} ${check.name}:`)
    console.log(`   ${displayValue}`)

    if (check.required && !check.value) {
      hasRequiredVars = false
    }
  })

  console.log('')

  if (!hasRequiredVars) {
    console.error('❌ Missing required environment variables!')
    console.error('Please check your .env.local file.')
    process.exit(1)
  }

  // Step 2: Test Supabase Connection
  console.log('📡 Step 2: Testing Supabase Connection')
  console.log('─────────────────────────────────────────────────')

  const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  const projectRef = SUPABASE_URL!.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]
  console.log('Project Reference:', projectRef || 'Unknown')
  console.log('Connection URL:', SUPABASE_URL)
  console.log('')

  // Step 3: SMTP Configuration Analysis
  console.log('📧 Step 3: SMTP Configuration Analysis')
  console.log('─────────────────────────────────────────────────')
  console.log('')
  console.log('Expected SMTP Settings in Supabase Dashboard:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('Enable Custom SMTP:  ✓ ON')
  console.log('')
  console.log('Host:                smtp.resend.com')
  console.log('Port:                465 (NOT 587)')
  console.log('Username:            resend (lowercase)')
  console.log('Password:            ' + (RESEND_API_KEY ? RESEND_API_KEY.substring(0, 15) + '...' : 'YOUR_RESEND_API_KEY'))
  console.log('')
  console.log('Sender Name:         East at West Restaurant')
  console.log('Sender Email:        onboarding@resend.dev (for testing)')
  console.log('                     OR')
  console.log('                     contact@eastatwest.com (after domain verification)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  // Step 4: Domain Verification Status
  console.log('🌐 Step 4: Domain Verification Status')
  console.log('─────────────────────────────────────────────────')

  if (RESEND_FROM_EMAIL === 'onboarding@resend.dev') {
    console.log('✅ Using Resend test email: onboarding@resend.dev')
    console.log('   ℹ️  Can only send to your Resend account email')
  } else if (RESEND_FROM_EMAIL === 'contact@eastatwest.com') {
    console.log('⚠️  Using custom domain: contact@eastatwest.com')
    console.log('   ⚠️  Requires domain verification in Resend')
    console.log('')
    console.log('   To verify domain:')
    console.log('   1. Go to: https://resend.com/domains')
    console.log('   2. Add domain: eastatwest.com')
    console.log('   3. Add DNS records to Hostinger')
    console.log('   4. Verify in Resend dashboard')
  } else {
    console.log('⚠️  Using email:', RESEND_FROM_EMAIL || 'Not configured')
  }

  console.log('')

  // Step 5: Test Email Sending
  console.log('📬 Step 5: Testing Email Send (Password Reset)')
  console.log('─────────────────────────────────────────────────')

  const testEmail = 'mbagnickg@gmail.com'
  console.log('Test Email:', testEmail)
  console.log('Attempting to send password reset email...')
  console.log('')

  const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
    redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password`
  })

  if (error) {
    console.log('❌ Email Send FAILED')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Error Details:')
    console.log('  Message:', error.message)
    console.log('  Status:', error.status)
    console.log('  Code:', (error as any).code || 'N/A')
    console.log('')

    console.log('🔧 Troubleshooting Steps:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (error.message.includes('recovery email')) {
      console.log('')
      console.log('⚠️  SMTP Configuration Issue Detected')
      console.log('')
      console.log('Common causes:')
      console.log('  1. SMTP not enabled in Supabase Dashboard')
      console.log('  2. Incorrect port (must be 465, not 587)')
      console.log('  3. Wrong username (must be "resend")')
      console.log('  4. Invalid Resend API key')
      console.log('  5. Sender email domain not verified')
      console.log('')
      console.log('Action Required:')
      console.log('  1. Go to: https://supabase.com/dashboard/project/' + projectRef + '/settings/auth')
      console.log('  2. Scroll to "SMTP Settings"')
      console.log('  3. Enable "Custom SMTP"')
      console.log('  4. Enter the settings shown in Step 3 above')
      console.log('  5. Change sender email to: onboarding@resend.dev (for testing)')
      console.log('  6. Click "Save"')
      console.log('  7. Wait 30 seconds')
      console.log('  8. Run this diagnostic again')
      console.log('')
    }

    console.log('Additional Checks:')
    console.log('  • Supabase Auth Logs: https://supabase.com/dashboard/project/' + projectRef + '/logs/auth-logs')
    console.log('  • Resend Dashboard: https://resend.com/emails')
    console.log('  • Resend API Key: https://resend.com/api-keys')
    console.log('')

    process.exit(1)
  } else {
    console.log('✅ Email Send SUCCESSFUL!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('📬 Next Steps:')
    console.log('  1. Check inbox: ' + testEmail)
    console.log('  2. Check spam/junk folder')
    console.log('  3. Verify Resend dashboard: https://resend.com/emails')
    console.log('  4. Check sender: ' + (RESEND_FROM_EMAIL || 'Not configured'))
    console.log('')
    console.log('Expected Sender:')
    console.log('  Name: East at West Restaurant')
    console.log('  Email: ' + (RESEND_FROM_EMAIL || 'onboarding@resend.dev'))
    console.log('')
  }

  // Final Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 Diagnostic Summary')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
  console.log('Status: ' + (error ? '❌ FAILED' : '✅ PASSED'))
  console.log('Project: ' + projectRef)
  console.log('Test Email: ' + testEmail)
  console.log('Sender: ' + (RESEND_FROM_EMAIL || 'onboarding@resend.dev'))
  console.log('')

  if (!error) {
    console.log('🎉 SMTP is working correctly!')
    console.log('')
    console.log('You can now:')
    console.log('  • Use password reset in your app')
    console.log('  • Send magic links')
    console.log('  • Send email confirmations')
    console.log('')
    console.log('For production, remember to:')
    console.log('  • Verify eastatwest.com domain in Resend')
    console.log('  • Update sender to: contact@eastatwest.com')
    console.log('  • Add DNS records in Hostinger')
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')
}

runDiagnostics().catch(error => {
  console.error('\n❌ Unexpected error during diagnostics:', error)
  process.exit(1)
})
