-- Migration to add 'completed' status to reservations table
-- This allows reservations to be marked as completed after the dining service

-- First, check if the constraint exists and drop it
DO $$
BEGIN
    -- Drop the constraint if it exists
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'reservations_status_check'
        AND conrelid = 'public.reservations'::regclass
    ) THEN
        ALTER TABLE public.reservations DROP CONSTRAINT reservations_status_check;
    END IF;
END $$;

-- Add new constraint including 'completed' status
ALTER TABLE public.reservations
ADD CONSTRAINT reservations_status_check
CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update comment
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
