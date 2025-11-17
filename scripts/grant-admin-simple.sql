-- Simple SQL script to grant admin access to a user
-- Run this in your Supabase SQL Editor

-- Step 1: See all users and their current roles
SELECT 
  id,
  email,
  user_metadata,
  app_metadata,
  user_metadata->>'role' as user_role,
  app_metadata->>'role' as app_role,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- Step 2: Grant admin access to a specific user
-- Replace 'your-email@example.com' with the actual email address
UPDATE auth.users 
SET user_metadata = jsonb_set(
  COALESCE(user_metadata, '{}'), 
  '{role}', 
  '"admin"'
)
WHERE email = 'your-email@example.com';

-- Step 3: Verify the change
SELECT 
  email,
  user_metadata->>'role' as role,
  user_metadata
FROM auth.users 
WHERE email = 'your-email@example.com';

-- Alternative: Grant admin access by user ID (if you know the ID)
-- UPDATE auth.users 
-- SET user_metadata = jsonb_set(
--   COALESCE(user_metadata, '{}'), 
--   '{role}', 
--   '"admin"'
-- )
-- WHERE id = 'user-uuid-here';
