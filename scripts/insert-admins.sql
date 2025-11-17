-- Insert admin users into the admin_users table
-- Run this in Supabase SQL Editor

-- First, let's check what columns exist
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'admin_users'
ORDER BY ordinal_position;

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'admin_users'
);

-- If table doesn't exist, create it
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for service role
CREATE POLICY IF NOT EXISTS "service_role_admin_users"
ON public.admin_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Insert or update admin users
-- User 1: mbagnickg@gmail.com
INSERT INTO public.admin_users (id, username, email, full_name, role, is_active)
VALUES (
  '0d208390-a566-4f07-81d4-7c8e08cbb95d',
  'mbagnickg',
  'mbagnickg@gmail.com',
  'Mbagnick Gaye',
  'admin',
  true
)
ON CONFLICT (email)
DO UPDATE SET
  id = EXCLUDED.id,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- User 2: infos.east.west@gmail.com
INSERT INTO public.admin_users (id, username, email, full_name, role, is_active)
VALUES (
  'f3585d54-1420-4f42-b6cf-dfb98ca61f32',
  'eastwest_admin',
  'infos.east.west@gmail.com',
  'East At West Admin',
  'admin',
  true
)
ON CONFLICT (email)
DO UPDATE SET
  id = EXCLUDED.id,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the inserts
SELECT id, username, email, full_name, role, is_active, created_at
FROM public.admin_users
ORDER BY created_at;
