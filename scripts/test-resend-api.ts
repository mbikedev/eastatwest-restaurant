/**
 * Test Resend API key validity
 * Usage: npm run test:resend-api
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const RESEND_API_KEY = process.env.RESEND_API_KEY

async function testResendAPI() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔑 Testing Resend API Key')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local')
    process.exit(1)
  }

  console.log('API Key:', RESEND_API_KEY.substring(0, 15) + '...')
  console.log('')
  console.log('Testing API key with Resend...')
  console.log('')

  try {
    // Test the API key by fetching domains
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.log('❌ API Key Test FAILED')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('')
      console.log('Status:', response.status)
      console.log('Error:', data)
      console.log('')
      console.log('Possible issues:')
      console.log('  1. API key is invalid or expired')
      console.log('  2. API key was regenerated in Resend dashboard')
      console.log('  3. API key lacks proper permissions')
      console.log('')
      console.log('To fix:')
      console.log('  1. Go to: https://resend.com/api-keys')
      console.log('  2. Create a new API key with "Sending access"')
      console.log('  3. Update RESEND_API_KEY in .env.local')
      console.log('  4. Update password in Supabase SMTP settings')
      console.log('')
      process.exit(1)
    }

    console.log('✅ API Key is VALID!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Domains configured in Resend:')

    if (data.data && data.data.length > 0) {
      data.data.forEach((domain: any) => {
        console.log('')
        console.log(`  Domain: ${domain.name}`)
        console.log(`  Status: ${domain.status}`)
        console.log(`  Region: ${domain.region || 'us-east-1'}`)
        if (domain.status === 'verified') {
          console.log('  ✅ Verified - Can send emails')
        } else {
          console.log('  ⚠️  Not verified - Add DNS records')
        }
      })
    } else {
      console.log('')
      console.log('  ⚠️  No domains configured')
      console.log('  Using default: onboarding@resend.dev')
    }

    console.log('')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('')
    console.log('Next steps:')
    console.log('  • API key is working correctly')
    console.log('  • Check SMTP settings in Supabase dashboard')
    console.log('  • Ensure sender email matches a verified domain')
    console.log('  • Or use onboarding@resend.dev for testing')
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

testResendAPI().catch(error => {
  console.error('\n❌ Unexpected error:', error)
  process.exit(1)
})
