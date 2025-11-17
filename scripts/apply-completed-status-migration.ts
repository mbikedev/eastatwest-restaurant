#!/usr/bin/env node

/**
 * Apply the 'completed' status migration to the reservations table
 * This script uses the service role key to directly execute SQL on Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
-- Migration to add 'completed' status to reservations table
-- This allows reservations to be marked as completed after the dining service

-- First, check if the constraint exists and drop it
DO $$
BEGIN
    -- Drop the constraint if it exists
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

async function applyMigration() {
  console.log('🔧 Applying migration to add "completed" status...');
  console.log('');

  try {
    // Execute the migration SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });

    if (error) {
      // The RPC might not exist, try direct query
      console.log('📝 Trying direct SQL execution...');

      const { error: directError } = await supabase
        .from('reservations')
        .select('id')
        .limit(0); // Just to test connection

      if (directError) {
        console.error('❌ Connection test failed:', directError);
        throw directError;
      }

      // If connection works, we need to use a different method
      console.log('⚠️  Direct SQL execution via REST API is not available.');
      console.log('');
      console.log('✅ Solution: Please run this SQL in your Supabase SQL Editor:');
      console.log('');
      console.log('1. Go to: https://supabase.com/dashboard/project/whixskigyxeligukorrm/sql/new');
      console.log('2. Copy and paste the following SQL:');
      console.log('');
      console.log('---BEGIN SQL---');
      console.log(migrationSQL);
      console.log('---END SQL---');
      console.log('');
      console.log('3. Click "Run" or press Ctrl+Enter');
      process.exit(1);
    }

    console.log('✅ Migration applied successfully!');
    console.log('');

    // Verify the constraint was updated
    console.log('🔍 Verifying constraint...');
    const { data: constraints, error: verifyError } = await supabase
      .from('information_schema.check_constraints')
      .select('constraint_name, check_clause')
      .like('constraint_name', '%reservations%status%');

    if (verifyError) {
      console.log('⚠️  Could not verify constraint (this is okay)');
    } else if (constraints && constraints.length > 0) {
      console.log('✅ Current constraint:', constraints[0]);
    }

    console.log('');
    console.log('🎉 Done! You can now use "completed" status for reservations.');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to https://eastatwest.com/admin/reservations');
    console.log('2. Update a reservation status to "Completed"');
    console.log('3. Refresh the page to verify it persists');

  } catch (err) {
    console.error('❌ Error applying migration:', err);
    console.error('');
    console.error('Please apply the migration manually in Supabase SQL Editor.');
    process.exit(1);
  }
}

applyMigration();
