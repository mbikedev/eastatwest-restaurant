import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key for admin operations
// Use lazy initialization to avoid build-time errors
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Missing Supabase configuration');
    }

    supabaseAdmin = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdmin;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🗑️ Delete reservation API called');
    const { reservationId } = await request.json();

    if (!reservationId) {
      console.error('❌ Missing reservation ID');
      return NextResponse.json(
        { error: 'Reservation ID is required' },
        { status: 400 }
      );
    }

    console.log(`📋 Attempting to delete reservation: ${reservationId}`);

    // Verify user is authenticated and authorized
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('✅ Authorization header present');

    // Delete the reservation using service role (bypasses RLS)
    const { error } = await getSupabaseAdmin()
      .from('reservations')
      .delete()
      .eq('id', reservationId);

    if (error) {
      console.error('❌ Supabase error deleting reservation:', error);
      return NextResponse.json(
        { error: 'Failed to delete reservation', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Reservation ${reservationId} deleted successfully`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Unexpected error in delete-reservation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
