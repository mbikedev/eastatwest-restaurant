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

// PATCH /api/admin/holidays/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('✏️ Update holiday API called for ID:', id);
    const holidayData = await request.json();

    // Verify user is authenticated and authorized
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate date range if both dates are provided
    if (holidayData.start_date && holidayData.end_date) {
      const startDate = new Date(holidayData.start_date);
      const endDate = new Date(holidayData.end_date);
      if (endDate < startDate) {
        return NextResponse.json(
          { error: 'End date must be after or equal to start date' },
          { status: 400 }
        );
      }
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from('holidays')
      .update(holidayData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error updating holiday:', error);
      return NextResponse.json(
        { error: 'Failed to update holiday', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Holiday not found' },
        { status: 404 }
      );
    }

    console.log('✅ Holiday updated successfully:', id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('❌ Unexpected error in PATCH holiday:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/holidays/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('🗑️ Delete holiday API called for ID:', id);

    // Verify user is authenticated and authorized
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from('holidays')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Supabase error deleting holiday:', error);
      return NextResponse.json(
        { error: 'Failed to delete holiday', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Holiday deleted successfully:', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Unexpected error in DELETE holiday:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
