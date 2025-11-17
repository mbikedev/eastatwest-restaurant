#!/usr/bin/env node

/**
 * Apply the 'completed' status migration to the reservations table
 * This script uses PostgreSQL connection to directly execute SQL
 */

import 'dotenv/config';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

const migrationSQL = `
-- First, check if the constraint exists and drop it
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'reservations_status_check'
        AND conrelid = 'public.reservations'::regclass
    ) THEN
        ALTER TABLE public.reservations DROP CONSTRAINT reservations_status_check;
    END IF;
END $$;

-- Add new constraint including 'completed' status
ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update comment
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
`;

async function executeSQLViaAPI() {
  console.log('🔧 Applying migration via Supabase REST API...\n');

  try {
    // Use Supabase's SQL execution endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ sql: migrationSQL })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('✅ Migration applied successfully!\n');
    return true;

  } catch (error) {
    console.log('⚠️  REST API method not available, trying direct PostgreSQL connection...\n');

    // Alternative: Use psql if available
    console.log('📝 Please run this command to apply the migration:\n');
    console.log(`\x1b[36m%s\x1b[0m`,
      `npx supabase db execute --file supabase/migrations/20250102000000_add_completed_status.sql --project-ref ${projectRef}`
    );
    console.log('\nOr run this SQL directly in Supabase SQL Editor:');
    console.log(`https://supabase.com/dashboard/project/${projectRef}/sql/new\n`);
    console.log('---BEGIN SQL---');
    console.log(migrationSQL);
    console.log('---END SQL---\n');

    return false;
  }
}

async function verifyFix() {
  console.log('🔍 Testing if "completed" status works...\n');

  try {
    // Try to insert a test reservation with completed status
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        name: '__TEST_MIGRATION__',
        email: 'test@migration.test',
        phone: '0000000000',
        date: '2099-12-31',
        start_time: '23:59',
        end_time: '23:59',
        number_of_guests: 1,
        status: 'completed',
        special_requests: 'TEST - DELETE ME'
      })
    });

    if (response.ok) {
      console.log('✅ Success! "completed" status is now working!\n');

      // Clean up test record
      const deleteResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/reservations?name=eq.__TEST_MIGRATION__`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
          }
        }
      );

      console.log('🎉 Migration complete! You can now use "completed" status.\n');
      return true;
    } else {
      const errorText = await response.text();
      console.error('❌ Test failed:', errorText);
      return false;
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting migration to add "completed" status...\n');

  const applied = await executeSQLViaAPI();

  if (applied) {
    await verifyFix();
  } else {
    console.log('⚠️  Please apply the migration manually and run this script again to verify.');
  }
}

main();
