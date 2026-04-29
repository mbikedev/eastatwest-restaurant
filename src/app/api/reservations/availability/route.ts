import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  calculateSlotCapacity,
  checkReservationFeasibility,
  suggestAlternativeSlots,
  MAX_CAPACITY,
} from '@/lib/capacityManager';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/**
 * GET /api/reservations/availability?date=2026-02-15
 *
 * Returns capacity information for every time slot on the given date.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: date' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch all active reservations for this date (not cancelled/completed)
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, name, start_time, end_time, guests, status')
      .eq('date', date)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      console.error('Error fetching reservations for availability:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reservation data' },
        { status: 500 }
      );
    }

    const slotCapacity = calculateSlotCapacity(reservations || []);

    return NextResponse.json({
      success: true,
      date,
      maxCapacity: MAX_CAPACITY,
      slots: slotCapacity,
    });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reservations/availability
 *
 * Checks if a specific reservation can be accommodated.
 * Body: { date, startTime, endTime, guests, excludeId? }
 *
 * Returns: { canBook, maxAvailable, conflictSlots, alternatives }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, startTime, endTime, guests, excludeId } = body;

    if (!date || !startTime || !endTime || !guests) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: date, startTime, endTime, guests' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // Fetch all active reservations for this date
    const { data: reservations, error } = await supabase
      .from('reservations')
      .select('id, name, start_time, end_time, guests, status')
      .eq('date', date)
      .in('status', ['confirmed', 'pending']);

    if (error) {
      console.error('Error fetching reservations for feasibility check:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch reservation data' },
        { status: 500 }
      );
    }

    const feasibility = checkReservationFeasibility(
      reservations || [],
      startTime,
      endTime,
      Number(guests),
      excludeId
    );

    let alternatives: { time: string; availableSeats: number }[] = [];
    if (!feasibility.canBook) {
      alternatives = suggestAlternativeSlots(
        reservations || [],
        startTime,
        Number(guests),
        date
      );
    }

    return NextResponse.json({
      success: true,
      ...feasibility,
      alternatives,
      maxCapacity: MAX_CAPACITY,
    });
  } catch (error) {
    console.error('Feasibility check API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
