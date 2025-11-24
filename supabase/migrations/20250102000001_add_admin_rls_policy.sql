-- Add RLS policy for admin users to manage all reservations
-- This allows whitelisted admin emails to view, update, and delete any reservation
-- Using (select auth.email()) for better query performance (avoids per-row re-evaluation)

-- Consolidated UPDATE policy (single policy to avoid multiple permissive policies)
-- Combines: customer update (own), staff update (all), admin email update (all)
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

CREATE POLICY "Reservations update policy" ON public.reservations
  FOR UPDATE
  USING (
    -- Customers can update their own reservations
    (select auth.email()) = email OR
    -- Service role or admin JWT can update any
    (select auth.role()) = 'service_role' OR
    ((select auth.jwt()) ->> 'role') = 'admin' OR
    -- Whitelisted admin emails can update any
    (select auth.email()) IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  )
  WITH CHECK (
    -- Customers can update their own reservations
    (select auth.email()) = email OR
    -- Service role or admin JWT can update any
    (select auth.role()) = 'service_role' OR
    ((select auth.jwt()) ->> 'role') = 'admin' OR
    -- Whitelisted admin emails can update any
    (select auth.email()) IN (
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

COMMENT ON POLICY "Reservations update policy" ON public.reservations
  IS 'Consolidated update policy: customers can update own, staff/service_role can update all, admin emails can update all';

COMMENT ON POLICY "Reservations select policy" ON public.reservations
  IS 'Consolidated select policy: customers can view own, staff/service_role can view all, admin emails can view all';

COMMENT ON POLICY "Reservations delete policy" ON public.reservations
  IS 'Consolidated delete policy: customers can delete own, staff/service_role can delete all, admin emails can delete all';
