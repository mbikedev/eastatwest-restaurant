-- Migration to add 'completed' status to reservations table
-- This allows reservations to be marked as completed after the dining service

-- Drop the old constraint
ALTER TABLE public.reservations
DROP CONSTRAINT IF EXISTS reservations_status_check;

-- Add new constraint including 'completed' status
ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update comment
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
