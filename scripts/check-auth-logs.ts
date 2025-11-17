/**
 * Check Supabase Auth logs for SMTP errors
 * Usage: npm run check:auth-logs
 */

import { config } from 'dotenv'
import { resolve } from 'path'

config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

async function checkAuthLogs() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Checking Supabase Auth Logs')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('')

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }

  const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

  console.log('Project:', projectRef)
  console.log('')
  console.log('⚠️  Note: Log fetching via API requires additional permissions.')
  console.log('Please manually check the Auth logs at:')
  console.log(`https://supabase.com/dashboard/project/${projectRef}/logs/auth-logs`)
  console.log('')
  console.log('Look for:')
  console.log('  • Recent error entries (red indicators)')
  console.log('  • SMTP connection errors')
  console.log('  • Authentication failures')
  console.log('  • Any messages containing "SMTP", "email", or "recovery"')
  console.log('')
  console.log('Common SMTP errors to look for:')
  console.log('  • "535 Authentication failed" - Wrong credentials')
  console.log('  • "Connection refused" - Port or host incorrect')
  console.log('  • "Relay access denied" - Authorization issue')
  console.log('  • "Timeout" - Firewall or connectivity issue')
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

checkAuthLogs().catch(error => {
  console.error('Error:', error)
  process.exit(1)
})
