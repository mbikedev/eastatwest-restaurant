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

async function checkSchema() {
  console.log('🔍 Checking admin_users table schema...\n')

  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error:', error.message)
    console.log('\nTrying to get all rows to see what columns exist...')

    const { data: allData, error: allError } = await supabase
      .from('admin_users')
      .select('*')

    if (allError) {
      console.error('Still error:', allError)
    } else {
      console.log('Current data in admin_users:', allData)
    }
  } else {
    console.log('Sample row from admin_users:')
    console.log(data)
  }
}

checkSchema().catch(console.error)
