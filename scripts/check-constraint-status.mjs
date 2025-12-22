#!/usr/bin/env node
/**
 * Check if the 'completed' status constraint is applied
 */

const SUPABASE_URL = "https://whixskigyxeligukorrm.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoaXhza2lneXhlbGlndWtvcnJtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTcyMzM4MCwiZXhwIjoyMDY3Mjk5MzgwfQ.9E66Bv5ujoMAketUCKgPWKX47BGjzrMV6s-QlzGCetU";

async function testCompletedStatus() {
  console.log('🔍 Testing if "completed" status is allowed in database...\n');

  // Create a test reservation with completed status
  const testData = {
    name: '__TEST_COMPLETED_STATUS__',
    email: 'test-completed@migration.test',
    phone: '0000000000',
    reservation_date: '2099-12-31',
    start_time: '23:59:00',
    end_time: '23:59:59',
    number_of_guests: 1,
    status: 'completed',
    special_requests: 'AUTO TEST - WILL BE DELETED'
  };

  try {
    // Try to insert a test record
    const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testData)
    });

    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.log('❌ FAILED: Cannot insert reservation with "completed" status\n');
      console.log('Error details:', errorText);
      console.log('\n🔧 The migration has NOT been applied yet.');
      console.log('\n📋 Please run the SQL from APPLY_MIGRATION_NOW.md\n');
      process.exit(1);
    }

    const result = await insertResponse.json();
    const insertedId = Array.isArray(result) ? result[0]?.id : result?.id;

    console.log('✅ SUCCESS: Test reservation created with "completed" status!');
    console.log('   Record ID:', insertedId);

    // Clean up - delete the test record
    if (insertedId) {
      const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/reservations?id=eq.${insertedId}`, {
        method: 'DELETE',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
        }
      });

      if (deleteResponse.ok) {
        console.log('🧹 Test record cleaned up successfully\n');
      }
    }

    console.log('🎉 The migration HAS been applied!');
    console.log('✅ You can now use "completed" status for reservations.\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error testing status:', error.message);
    console.log('\n🔧 The migration may not be applied yet.\n');
    process.exit(1);
  }
}

testCompletedStatus();
