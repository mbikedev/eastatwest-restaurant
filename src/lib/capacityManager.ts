import { Reservation } from '@/types/supabase';

export const MAX_CAPACITY = 22;

// Service periods
export const SERVICE_PERIODS = {
  lunch: { start: '11:30', end: '14:30', label: 'Lunch' },
  dinner: { start: '18:00', end: '22:00', label: 'Dinner' },
} as const;

// All bookable time slots (start times customers can select)
export const TIME_SLOTS = [
  '11:30', '12:00', '12:30', '13:00', '13:30', '14:00',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00',
];

/**
 * Determines the service period a time belongs to.
 */
export function getServicePeriod(time: string): 'lunch' | 'dinner' | null {
  const [h, m] = time.split(':').map(Number);
  const minutes = h * 60 + m;

  const lunchStart = 11 * 60 + 30; // 11:30
  const lunchEnd = 14 * 60 + 30;   // 14:30
  const dinnerStart = 18 * 60;      // 18:00
  const dinnerEnd = 22 * 60;        // 22:00

  if (minutes >= lunchStart && minutes <= lunchEnd) return 'lunch';
  if (minutes >= dinnerStart && minutes <= dinnerEnd) return 'dinner';
  return null;
}

/**
 * Checks if two time ranges overlap.
 * A reservation [s1, e1) overlaps with slot [s2, e2) if s1 < e2 AND s2 < e1.
 */
export function timesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Given a list of active reservations for a specific date, calculates
 * how many guests are seated during each time slot.
 *
 * Returns a map: timeSlot -> { totalGuests, remainingCapacity, reservations[] }
 */
export function calculateSlotCapacity(
  reservations: Pick<Reservation, 'id' | 'start_time' | 'end_time' | 'guests' | 'name' | 'status'>[],
  date?: string
): Record<string, {
  totalGuests: number;
  remainingCapacity: number;
  isFull: boolean;
  reservations: { id: string; name: string; guests: number; start_time: string; end_time: string }[];
}> {
  const result: Record<string, {
    totalGuests: number;
    remainingCapacity: number;
    isFull: boolean;
    reservations: { id: string; name: string; guests: number; start_time: string; end_time: string }[];
  }> = {};

  // Initialize all time slots
  for (const slot of TIME_SLOTS) {
    result[slot] = {
      totalGuests: 0,
      remainingCapacity: MAX_CAPACITY,
      isFull: false,
      reservations: [],
    };
  }

  // Only count reservations that are confirmed or pending (not cancelled/completed)
  const activeReservations = reservations.filter(
    r => r.status === 'confirmed' || r.status === 'pending'
  );

  // For each time slot, find overlapping reservations
  for (const slot of TIME_SLOTS) {
    // A slot represents the point in time when a guest arrives.
    // We need to find all reservations that are active during this slot.
    // A reservation is active during a slot if: reservation.start_time <= slot < reservation.end_time
    const overlapping = activeReservations.filter(r =>
      r.start_time <= slot && slot < r.end_time
    );

    const totalGuests = overlapping.reduce((sum, r) => sum + r.guests, 0);

    result[slot] = {
      totalGuests,
      remainingCapacity: Math.max(0, MAX_CAPACITY - totalGuests),
      isFull: totalGuests >= MAX_CAPACITY,
      reservations: overlapping.map(r => ({
        id: r.id,
        name: r.name,
        guests: r.guests,
        start_time: r.start_time,
        end_time: r.end_time,
      })),
    };
  }

  return result;
}

/**
 * Calculate capacity for an entire service period (lunch or dinner).
 * Returns the peak (maximum) number of guests at any point during the period.
 */
export function getServicePeriodCapacity(
  reservations: Pick<Reservation, 'id' | 'start_time' | 'end_time' | 'guests' | 'name' | 'status'>[],
  period: 'lunch' | 'dinner'
): { peakGuests: number; remainingCapacity: number; isFull: boolean } {
  const slotCapacity = calculateSlotCapacity(reservations);
  const periodSlots = TIME_SLOTS.filter(slot => getServicePeriod(slot) === period);

  let peakGuests = 0;
  for (const slot of periodSlots) {
    if (slotCapacity[slot].totalGuests > peakGuests) {
      peakGuests = slotCapacity[slot].totalGuests;
    }
  }

  return {
    peakGuests,
    remainingCapacity: Math.max(0, MAX_CAPACITY - peakGuests),
    isFull: peakGuests >= MAX_CAPACITY,
  };
}

/**
 * Checks whether a proposed reservation can be accommodated.
 * Verifies that at NO point during the reservation's duration would the
 * total capacity exceed MAX_CAPACITY.
 *
 * Returns { canBook, conflictSlots[], maxAvailable }
 */
export function checkReservationFeasibility(
  existingReservations: Pick<Reservation, 'id' | 'start_time' | 'end_time' | 'guests' | 'name' | 'status'>[],
  proposedStart: string,
  proposedEnd: string,
  proposedGuests: number,
  excludeReservationId?: string
): {
  canBook: boolean;
  maxAvailable: number;
  conflictSlots: string[];
  peakOccupancy: number;
} {
  // Filter out the reservation being edited
  const filteredReservations = excludeReservationId
    ? existingReservations.filter(r => r.id !== excludeReservationId)
    : existingReservations;

  const slotCapacity = calculateSlotCapacity(filteredReservations);

  // Check each time slot within the proposed reservation time range
  const slotsInRange = TIME_SLOTS.filter(
    slot => slot >= proposedStart && slot < proposedEnd
  );

  let maxOccupancy = 0;
  const conflictSlots: string[] = [];

  for (const slot of slotsInRange) {
    const currentGuests = slotCapacity[slot]?.totalGuests || 0;
    const wouldBeTotal = currentGuests + proposedGuests;

    if (wouldBeTotal > MAX_CAPACITY) {
      conflictSlots.push(slot);
    }
    if (currentGuests > maxOccupancy) {
      maxOccupancy = currentGuests;
    }
  }

  return {
    canBook: conflictSlots.length === 0,
    maxAvailable: Math.max(0, MAX_CAPACITY - maxOccupancy),
    conflictSlots,
    peakOccupancy: maxOccupancy,
  };
}

/**
 * Suggests alternative time slots when the requested one is full.
 * Finds slots in the same service period that can accommodate the requested party size.
 */
export function suggestAlternativeSlots(
  existingReservations: Pick<Reservation, 'id' | 'start_time' | 'end_time' | 'guests' | 'name' | 'status'>[],
  requestedStart: string,
  guests: number,
  date: string
): { time: string; availableSeats: number }[] {
  const slotCapacity = calculateSlotCapacity(existingReservations);
  const requestedPeriod = getServicePeriod(requestedStart);
  const alternatives: { time: string; availableSeats: number }[] = [];

  // Check day of week for Saturday restriction
  const dayOfWeek = new Date(date).getDay();
  const isSaturday = dayOfWeek === 6;

  for (const slot of TIME_SLOTS) {
    const slotPeriod = getServicePeriod(slot);

    // On Saturday, only suggest dinner slots
    if (isSaturday && slotPeriod !== 'dinner') continue;

    // Skip the slot that was already requested
    if (slot === requestedStart) continue;

    const capacity = slotCapacity[slot];
    if (capacity.remainingCapacity >= guests) {
      alternatives.push({
        time: slot,
        availableSeats: capacity.remainingCapacity,
      });
    }
  }

  // Sort: prefer same period first, then by available seats (descending)
  alternatives.sort((a, b) => {
    const aPeriod = getServicePeriod(a.time);
    const bPeriod = getServicePeriod(b.time);

    // Same period as requested gets priority
    if (aPeriod === requestedPeriod && bPeriod !== requestedPeriod) return -1;
    if (bPeriod === requestedPeriod && aPeriod !== requestedPeriod) return 1;

    // Then sort by available seats descending
    return b.availableSeats - a.availableSeats;
  });

  return alternatives;
}
