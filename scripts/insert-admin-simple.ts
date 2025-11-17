import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function insertAdmins() {
  console.log('🚀 Inserting admin users into admin_users table...\n')

  // Get the auth users first
  const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

  if (authError) {
    console.error('Error getting auth users:', authError)
    return
  }

  const user1 = authUsers?.users?.find(u => u.email === 'mbagnickg@gmail.com')
  const user2 = authUsers?.users?.find(u => u.email === 'infos.east.west@gmail.com')

  if (!user1 || !user2) {
    console.error('Could not find auth users')
    return
  }

  console.log('User 1 ID:', user1.id)
  console.log('User 2 ID:', user2.id)

  // Try inserting with minimal fields first
  const adminsToInsert = [
    {
      id: user1.id,
      email: 'mbagnickg@gmail.com',
      username: 'mbagnickg'
    },
    {
      id: user2.id,
      email: 'infos.east.west@gmail.com',
      username: 'eastwest_admin'
    }
  ]

  for (const admin of adminsToInsert) {
    console.log(`\nInserting ${admin.email}...`)

    const { data, error } = await supabase
      .from('admin_users')
      .insert(admin)
      .select()

    if (error) {
      console.error('Error:', error.message)
      console.error('Details:', error)
    } else {
      console.log('✅ Success:', data)
    }
  }
}

insertAdmins().catch(console.error)
