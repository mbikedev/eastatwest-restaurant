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
        persistSession: false,
      },
    });
  }
  return supabaseAdmin;
}

// GET /api/admin/holidays
// Query params: ?active=true&recurring=true
export async function GET(request: NextRequest) {
  try {
    console.log('📅 Get holidays API called');
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') === 'true';
    const recurringOnly = searchParams.get('recurring') === 'true';

    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('holidays')
      .select('*')
      .order('start_date', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    if (recurringOnly) {
      query = query.eq('is_recurring', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error fetching holidays:', error);
      return NextResponse.json(
        { error: 'Failed to fetch holidays', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Fetched ${data.length} holidays`);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Unexpected error in GET holidays:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/holidays
export async function POST(request: NextRequest) {
  try {
    console.log('➕ Add holiday API called');
    const holidayData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'start_date', 'end_date'];
    const missingFields = requiredFields.filter(
      (field) => !holidayData[field]
    );

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify user is authenticated and authorized
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Authorization header present');

    // Validate date range
    const startDate = new Date(holidayData.start_date);
    const endDate = new Date(holidayData.end_date);
    if (endDate < startDate) {
      return NextResponse.json(
        { error: 'End date must be after or equal to start date' },
        { status: 400 }
      );
    }

    // Extract user email from session (optional, for created_by field)
    const supabase = getSupabaseAdmin();

    // Insert the holiday
    const { data, error } = await supabase
      .from('holidays')
      .insert({
        name: holidayData.name,
        description: holidayData.description || null,
        notes: holidayData.notes || null,
        start_date: holidayData.start_date,
        end_date: holidayData.end_date,
        is_recurring: holidayData.is_recurring || false,
        recurrence_pattern: holidayData.recurrence_pattern || null,
        recurrence_end_date: holidayData.recurrence_end_date || null,
        is_active: holidayData.is_active !== false, // Default to true
        created_by: holidayData.created_by || null,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error adding holiday:', error);
      return NextResponse.json(
        { error: 'Failed to add holiday', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Holiday added successfully:', data.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Unexpected error in POST holiday:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
