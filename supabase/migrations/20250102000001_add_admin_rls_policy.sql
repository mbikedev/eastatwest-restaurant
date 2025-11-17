-- Add RLS policy for admin users to manage all reservations
-- This allows whitelisted admin emails to view, update, and delete any reservation

-- Drop existing restrictive update policy
DROP POLICY IF EXISTS "Users can update own reservations" ON public.reservations;

-- Create new policy that allows users to update their own reservations OR admins to update any
CREATE POLICY "Users and admins can update reservations" ON public.reservations
  FOR UPDATE
  USING (
    auth.email() = email OR  -- Users can update their own
    auth.email() IN (        -- OR admins can update any
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Also update the SELECT policy to allow admins to view all reservations
DROP POLICY IF EXISTS "Users can view own reservations" ON public.reservations;

CREATE POLICY "Users and admins can view reservations" ON public.reservations
  FOR SELECT
  USING (
    auth.email() = email OR  -- Users can view their own
    auth.email() IN (        -- OR admins can view all
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Add DELETE policy for admins
CREATE POLICY "Admins can delete reservations" ON public.reservations
  FOR DELETE
  USING (
    auth.email() IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

COMMENT ON POLICY "Users and admins can update reservations" ON public.reservations
  IS 'Allows users to update their own reservations and admin emails to update any reservation';

COMMENT ON POLICY "Users and admins can view reservations" ON public.reservations
  IS 'Allows users to view their own reservations and admin emails to view all reservations';

COMMENT ON POLICY "Admins can delete reservations" ON public.reservations
  IS 'Allows admin emails to delete any reservation';
