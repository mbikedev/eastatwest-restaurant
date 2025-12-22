import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Type for the RPC function response
type HolidayCheckResponse = {
  is_holiday: boolean;
  holiday_id: string | null;
  holiday_name: string | null;
  message: string | null;
};

// GET /api/holidays/check?date=2025-12-25
// Public endpoint to check if a specific date is a holiday
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Use public anon key for this query (RLS policies will apply)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Call the check_date_is_holiday RPC function
    const { data, error } = await supabase
      .rpc('check_date_is_holiday', { check_date: dateParam })
      .single();

    if (error) {
      console.error('Error checking holiday:', error);
      return NextResponse.json(
        { error: 'Failed to check holiday status', details: error.message },
        { status: 500 }
      );
    }

    // Cast data to the expected type
    const holidayData = data as HolidayCheckResponse;

    return NextResponse.json({
      success: true,
      is_holiday: holidayData.is_holiday || false,
      holiday_id: holidayData.holiday_id || null,
      holiday_name: holidayData.holiday_name || null,
      message: holidayData.message || null,
    });
  } catch (error) {
    console.error('Unexpected error in holiday check:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
