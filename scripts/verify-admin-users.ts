import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const ADMIN_EMAILS = [
  'mbagnickg@gmail.com',
  'infos.east.west@gmail.com'
]

async function verifyAdminUsers() {
  console.log('🔍 Verifying admin users...\n')

  try {
    const { data: users, error } = await supabase.auth.admin.listUsers()

    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }

    console.log('📊 Admin Users Status:\n')
    console.log('─'.repeat(80))

    for (const email of ADMIN_EMAILS) {
      const user = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

      if (!user) {
        console.log(`❌ ${email}`)
        console.log(`   Status: NOT FOUND`)
        console.log('─'.repeat(80))
        continue
      }

      const role = user.user_metadata?.role || 'none'
      const isAdmin = role === 'admin'

      console.log(`${isAdmin ? '✅' : '⚠️ '} ${email}`)
      console.log(`   User ID: ${user.id}`)
      console.log(`   Role: ${role}`)
      console.log(`   Email Confirmed: ${user.email_confirmed_at ? '✓' : '✗'}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`)
      console.log(`   Last Sign In: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}`)
      console.log('─'.repeat(80))
    }

    console.log('\n✨ Verification complete!')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

verifyAdminUsers().catch(console.error)
