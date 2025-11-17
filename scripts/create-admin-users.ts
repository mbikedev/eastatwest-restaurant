import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗')
  process.exit(1)
}

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const ADMIN_USERS = [
  {
    email: 'mbagnickg@gmail.com',
    username: 'mbagnickg',
    full_name: 'Mbagnick Gaye'
  },
  {
    email: 'infos.east.west@gmail.com',
    username: 'eastwest_admin',
    full_name: 'East At West Admin'
  }
]

async function createAdminUser(adminUser: typeof ADMIN_USERS[0]) {
  console.log(`\n📧 Processing admin user: ${adminUser.email}`)

  try {
    // Check if user exists in auth.users
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Error checking existing users:', listError.message)
      return
    }

    const existingAuthUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === adminUser.email.toLowerCase())

    if (!existingAuthUser) {
      console.error(`❌ User ${adminUser.email} not found in auth.users. Please create the auth user first.`)
      return
    }

    console.log(`✓ Found auth user with ID: ${existingAuthUser.id}`)

    // Update auth user metadata to ensure they have admin role
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingAuthUser.id,
      {
        user_metadata: {
          ...existingAuthUser.user_metadata,
          role: 'admin'
        }
      }
    )

    if (updateError) {
      console.error('❌ Error updating user metadata:', updateError.message)
    } else {
      console.log('✓ Updated auth.users metadata with admin role')
    }

    // Check if user already exists in admin_users table
    const { data: existingAdminUser, error: selectError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', adminUser.email)
      .single()

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('❌ Error checking admin_users table:', selectError.message)
      return
    }

    if (existingAdminUser) {
      console.log(`ℹ️  User already exists in admin_users table`)

      // Update existing admin user
      const { error: updateAdminError } = await supabase
        .from('admin_users')
        .update({
          id: existingAuthUser.id, // Link to auth.users id
          username: adminUser.username,
          full_name: adminUser.full_name,
          role: 'admin',
          is_active: true,
          updated_at: new Date().toISOString()
        })
        .eq('email', adminUser.email)

      if (updateAdminError) {
        console.error('❌ Error updating admin_users table:', updateAdminError.message)
      } else {
        console.log('✅ Updated admin_users table successfully')
      }
    } else {
      // Insert new admin user
      const { error: insertError } = await supabase
        .from('admin_users')
        .insert({
          id: existingAuthUser.id, // Link to auth.users id
          username: adminUser.username,
          email: adminUser.email,
          full_name: adminUser.full_name,
          role: 'admin',
          is_active: true
        })

      if (insertError) {
        console.error('❌ Error inserting into admin_users table:', insertError.message)
      } else {
        console.log('✅ Inserted into admin_users table successfully')
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

async function main() {
  console.log('🚀 Starting admin user creation process...')
  console.log('📍 Supabase URL:', supabaseUrl)
  console.log('👥 Admin users to process:', ADMIN_USERS.length)

  for (const adminUser of ADMIN_USERS) {
    await createAdminUser(adminUser)
  }

  console.log('\n✨ Admin user creation process completed!')
  console.log('\n📝 Summary:')
  console.log('   - Both users have been processed')
  console.log('   - Admin records created/updated in admin_users table')
  console.log('   - Auth users updated with admin role in metadata')
  console.log('\n🔗 Admin Dashboard: https://whixskigyxeligukorrm.supabase.co')
}

main().catch(console.error)
