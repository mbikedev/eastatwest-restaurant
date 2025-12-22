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

const ADMIN_EMAIL = 'hannamoubayed@hotmail.com'
const DEFAULT_PASSWORD = 'TempAdmin2025!'

async function createThirdAdmin() {
  console.log('🚀 Creating third admin user: Hanna 2\n')

  try {
    // Check if user already exists in auth.users
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error('❌ Error checking existing users:', listError.message)
      return
    }

    let userId: string

    const existingAuthUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase())

    if (existingAuthUser) {
      console.log(`✓ User already exists in auth.users`)
      console.log(`  User ID: ${existingAuthUser.id}`)
      userId = existingAuthUser.id

      // Update metadata to ensure admin role
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
    } else {
      // Create new auth user
      console.log('🔨 Creating new auth user...')
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: ADMIN_EMAIL,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          name: 'Hanna 2'
        }
      })

      if (createError) {
        console.error('❌ Error creating auth user:', createError.message)
        return
      }

      userId = newUser.user!.id
      console.log('✅ Auth user created successfully!')
      console.log(`   User ID: ${userId}`)
      console.log(`   Email: ${ADMIN_EMAIL}`)
      console.log(`   Temporary Password: ${DEFAULT_PASSWORD}`)
      console.log('   ⚠️  User should change password on first login')
    }

    // Now add to admin_users table
    console.log('\n📧 Adding to admin_users table...')

    const { data: insertData, error: insertError } = await supabase
      .from('admin_users')
      .insert({
        user_id: userId,
        email: ADMIN_EMAIL,
        role: 'admin'
      })
      .select()

    if (insertError) {
      if (insertError.code === '23505') {
        console.log('ℹ️  User already exists in admin_users table')
      } else {
        console.error('❌ Error inserting into admin_users:', insertError.message)
      }
    } else {
      console.log('✅ Successfully added to admin_users table!')
    }

    console.log('\n✨ Third admin user setup completed!')
    console.log('\n📝 Admin User Details:')
    console.log('   Name: Hanna 2')
    console.log(`   Email: ${ADMIN_EMAIL}`)
    console.log(`   User ID: ${userId}`)
    console.log('   Role: admin')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

createThirdAdmin().catch(console.error)
