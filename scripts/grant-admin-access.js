#!/usr/bin/env node

/**
 * Script to grant admin access to the current user
 * This script will:
 * 1. Check who is currently logged in
 * 2. Show their current role
 * 3. Grant admin access by updating user metadata
 * 
 * Usage: node scripts/grant-admin-access.js [email]
 * If no email is provided, it will attempt to get the current user
 */

// Use require for Node.js compatibility
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nMake sure these are set in your .env.local file');
  process.exit(1);
}

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function getCurrentUserInfo() {
  try {
    // Get current user from the browser session (if any)
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log('ℹ️  No current user session found');
      return null;
    }

    console.log('👤 Current user info:');
    console.log(`   Email: ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Current role: ${user.user_metadata?.role || user.app_metadata?.role || 'none'}`);
    console.log(`   User metadata:`, user.user_metadata);
    console.log(`   App metadata:`, user.app_metadata);
    
    return user;
  } catch (error) {
    console.error('❌ Error getting current user:', error.message);
    return null;
  }
}

async function listAllUsers() {
  try {
    console.log('\n📋 All users in the system:');
    
    // Use admin API to list all users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('❌ Error listing users:', error.message);
      return [];
    }

    users.forEach((user, index) => {
      const role = user.user_metadata?.role || user.app_metadata?.role || 'none';
      console.log(`   ${index + 1}. ${user.email} (ID: ${user.id.substring(0, 8)}...) - Role: ${role}`);
    });

    return users;
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
    return [];
  }
}

async function grantAdminAccess(userEmail) {
  try {
    console.log(`\n🔐 Granting admin access to: ${userEmail}`);
    
    // Find user by email
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      throw new Error(`Failed to list users: ${listError.message}`);
    }

    const user = users.find(u => u.email === userEmail);
    
    if (!user) {
      throw new Error(`User with email ${userEmail} not found`);
    }

    // Update user metadata to include admin role
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        role: 'admin'
      }
    });

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }

    console.log('✅ Successfully granted admin access!');
    console.log(`   User: ${data.user.email}`);
    console.log(`   New role: ${data.user.user_metadata?.role}`);
    console.log('\n💡 The user will need to sign out and sign back in for changes to take effect.');
    
    return data.user;
  } catch (error) {
    console.error('❌ Error granting admin access:', error.message);
    throw error;
  }
}

async function main() {
  console.log('🚀 Admin Access Grant Script');
  console.log('============================\n');

  // Get email from command line argument or current user
  const targetEmail = process.argv[2];
  
  if (targetEmail) {
    console.log(`🎯 Target email: ${targetEmail}`);
    await grantAdminAccess(targetEmail);
  } else {
    // Show current user info
    const currentUser = await getCurrentUserInfo();
    
    // List all users
    const allUsers = await listAllUsers();
    
    if (allUsers.length === 0) {
      console.log('\n⚠️  No users found. You may need to create a user first.');
      console.log('\nTo create a user, you can:');
      console.log('1. Use the Supabase Dashboard (Authentication > Users)');
      console.log('2. Sign up through your application');
      return;
    }
    
    if (currentUser) {
      // Grant admin to current user
      await grantAdminAccess(currentUser.email);
    } else {
      console.log('\n❓ No current user session found.');
      console.log('\nTo grant admin access to a specific user, run:');
      console.log('   node scripts/grant-admin-access.js user@example.com');
      console.log('\nOr sign in to your application first, then run this script again.');
    }
  }
}

// Run the script
main().catch(console.error);
