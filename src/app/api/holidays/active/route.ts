import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

/**
 * GET /api/holidays/active
 * Public endpoint to fetch all active holidays
 * Used by the reservation calendar to disable holiday dates
 */
export async function GET() {
  try {
    console.log('📅 Fetching active holidays for calendar');

    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .eq('is_active', true)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('❌ Error fetching active holidays:', error);
      return NextResponse.json(
        { error: 'Failed to fetch holidays', details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Fetched ${data?.length || 0} active holidays`);
    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    console.error('❌ Unexpected error fetching active holidays:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
