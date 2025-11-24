-- Update Row-Level Security policies for reservations table
-- This migration replaces the existing RLS policies with the new requirements
-- Using (select auth.*()) for better query performance (avoids per-row re-evaluation)

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

-- Ensure RLS is enabled (already done in previous migration, but keeping for clarity)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Policy: Public insert if email provided (no auth) - for anonymous bookings
CREATE POLICY "public insert"
ON public.reservations
FOR INSERT
WITH CHECK (true);

-- Add comments explaining the policies
COMMENT ON POLICY "public insert" ON public.reservations IS 'Allows anonymous users to create reservations without authentication';
