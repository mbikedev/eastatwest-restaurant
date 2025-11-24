-- Fix RLS policies for comments to allow admins to see and manage ALL comments (including pending)
-- This allows admin emails to view, approve, and delete all comments including unapproved ones
-- Using (select auth.email()) for better query performance (avoids per-row re-evaluation)

-- Drop existing restrictive SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved comments" ON public.comments;

-- Create new SELECT policy: Public sees approved, admins see all
CREATE POLICY "Public can read approved, admins can read all comments" ON public.comments
  FOR SELECT
  USING (
    is_approved = true OR  -- Public can see approved comments
    (select auth.email()) IN (      -- OR admins can see ALL comments
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Update UPDATE policy to allow admins (for approving/disapproving)
DROP POLICY IF EXISTS "Authenticated users can update comments" ON public.comments;

CREATE POLICY "Admins can update comments" ON public.comments
  FOR UPDATE
  USING (
    (select auth.email()) IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

-- Add DELETE policy for admins
CREATE POLICY "Admins can delete comments" ON public.comments
  FOR DELETE
  USING (
    (select auth.email()) IN (
      'mbagnickg@gmail.com',
      'infos.east.west@gmail.com',
      'east.westbrussels@gmail.com'
    )
  );

COMMENT ON POLICY "Public can read approved, admins can read all comments" ON public.comments
  IS 'Allows anyone to read approved comments, and admin emails to read all comments including pending approval';

COMMENT ON POLICY "Admins can update comments" ON public.comments
  IS 'Allows admin emails to approve, disapprove, or update any comment';

COMMENT ON POLICY "Admins can delete comments" ON public.comments
  IS 'Allows admin emails to delete any comment';
