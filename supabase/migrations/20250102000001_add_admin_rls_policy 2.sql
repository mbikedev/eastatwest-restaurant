-- Add RLS policy for admin users to manage all reservations
-- This allows whitelisted admin emails to view, update, and delete any reservation
-- Using (select auth.email()) for better query performance (avoids per-row re-evaluation)

-- Drop existing restrictive update policy
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

-- Create new policy that allows users to update their own reservations OR admins to update any
CREATE POLICY "Users and admins can update reservations" ON public.reservations
  FOR UPDATE
  USING (
    (select auth.email()) = email OR  -- Users can update their own
    (select auth.email()) IN (        -- OR admins can update any
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Consolidated SELECT policy (single policy to avoid multiple permissive policies)
-- Combines: customer select (own), staff select (all), admin email select (all)
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;

CREATE POLICY "Reservations select policy" ON public.reservations
  FOR SELECT
  USING (
    -- Customers can view their own reservations
    (select auth.email()) = email OR
    -- Service role or admin JWT can view any
    (select auth.role()) = 'service_role' OR
    ((select auth.jwt()) ->> 'role') = 'admin' OR
    -- Whitelisted admin emails can view any
    (select auth.email()) IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Consolidated DELETE policy (single policy to avoid multiple permissive policies)
-- Combines: customer delete (own), staff delete (all), admin email delete (all)
CREATE POLICY "Reservations delete policy" ON public.reservations
  FOR DELETE
  USING (
    -- Customers can delete their own reservations
    (select auth.email()) = email OR
    -- Service role or admin JWT can delete any
    (select auth.role()) = 'service_role' OR
    ((select auth.jwt()) ->> 'role') = 'admin' OR
    -- Whitelisted admin emails can delete any
    (select auth.email()) IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

COMMENT ON POLICY "Users and admins can update reservations" ON public.reservations
  IS 'Allows users to update their own reservations and admin emails to update any reservation';

COMMENT ON POLICY "Users and admins can view reservations" ON public.reservations
  IS 'Allows users to view their own reservations and admin emails to view all reservations';

COMMENT ON POLICY "Reservations delete policy" ON public.reservations
  IS 'Consolidated delete policy: customers can delete own, staff/service_role can delete all, admin emails can delete all';
