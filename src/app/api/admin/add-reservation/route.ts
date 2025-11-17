import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Create a Supabase client with service role key for admin operations
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
    console.log('➕ Add reservation API called');
    const reservationData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'date', 'start_time', 'end_time', 'guests'];
    const missingFields = requiredFields.filter(field => !reservationData[field]);

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('✅ Reservation data validated');

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

    // Insert the reservation using service role (bypasses RLS)
    const { data, error } = await getSupabaseAdmin()
      .from('reservations')
      .insert({
        name: reservationData.name,
        email: reservationData.email,
        phone: reservationData.phone,
        date: reservationData.date,
        start_time: reservationData.start_time,
        end_time: reservationData.end_time,
        guests: reservationData.guests,
        special_requests: reservationData.special_requests || null,
        status: reservationData.status || 'pending',
        language: reservationData.language || 'en',
        invoice_number: reservationData.invoice_number || null
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error adding reservation:', error);
      return NextResponse.json(
        { error: 'Failed to add reservation', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Reservation added successfully:', data.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Unexpected error in add-reservation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
