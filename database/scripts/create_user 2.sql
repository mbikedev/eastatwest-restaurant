-- =====================================================
-- Create New User in Supabase Authentication
-- User: Mbagnick Gaye
-- =====================================================

-- =====================================================
-- 1. INSERT INTO AUTH.USERS (Supabase Authentication)
-- =====================================================

-- Note: This is typically done through Supabase Auth UI or API
-- But here's the SQL equivalent for reference:

INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at
) VALUES (
  gen_random_uuid(), -- id (will be generated)
  '00000000-0000-0000-0000-000000000000', -- instance_id (default)
  'authenticated', -- aud
  'authenticated', -- role
  'mbagnickg@gmail.com', -- email
  crypt('your_password_here', gen_salt('bf')), -- encrypted_password (you'll need to set this)
  NOW(), -- email_confirmed_at
  NULL, -- invited_at
  '', -- confirmation_token
  NULL, -- confirmation_sent_at
  '', -- recovery_token
  NULL, -- recovery_sent_at
  '', -- email_change_token_new
  '', -- email_change
  NULL, -- email_change_sent_at
  NOW(), -- last_sign_in_at
  '{"provider": "email", "providers": ["email"]}', -- raw_app_meta_data
  '{"name": "Mbagnick Gaye", "phone": "+32496935745"}', -- raw_user_meta_data
  false, -- is_super_admin
  NOW(), -- created_at
  NOW(), -- updated_at
  '+32496935745', -- phone
  NOW(), -- phone_confirmed_at
  '', -- phone_change
  '', -- phone_change_token
  NULL, -- phone_change_sent_at
  '', -- email_change_token_current
  0, -- email_change_confirm_status
  NULL, -- banned_until
  '', -- reauthentication_token
  NULL -- reauthentication_sent_at
);

-- =====================================================
-- 2. INSERT INTO PUBLIC.ADMIN_USERS (if you have this table)
-- =====================================================

-- First, get the user ID that was just created
-- You'll need to replace 'USER_UUID_HERE' with the actual UUID from step 1

INSERT INTO public.admin_users (
  id,
  username,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'USER_UUID_HERE', -- Replace with actual UUID from auth.users
  'mbagnickg', -- username
  'mbagnickg@gmail.com', -- email
  'Mbagnick Gaye', -- full_name
  'admin', -- role (or 'manager' or 'staff')
  true, -- is_active
  NOW(), -- created_at
  NOW() -- updated_at
);

-- =====================================================
-- 3. ALTERNATIVE: Create user through Supabase Auth API
-- =====================================================

-- This is the recommended way to create users in Supabase
-- Use the Supabase Auth API or Dashboard instead of direct SQL

-- Example using Supabase JavaScript client:
/*
const { data, error } = await supabase.auth.admin.createUser({
  email: 'mbagnickg@gmail.com',
  password: 'your_secure_password',
  email_confirm: true,
  user_metadata: {
    name: 'Mbagnick Gaye',
    phone: '+32496935745'
  }
})
*/

-- =====================================================
-- 4. SIMPLER APPROACH: Use Supabase Dashboard
-- =====================================================

/*
1. Go to your Supabase Dashboard
2. Navigate to Authentication > Users
3. Click "Add User"
4. Fill in the details:
   - Email: mbagnickg@gmail.com
   - Password: (set a secure password)
   - User Metadata:
     {
       "name": "Mbagnick Gaye",
       "phone": "+32496935745"
     }
5. Click "Create User"
*/

-- =====================================================
-- 5. GET USER ID FOR REFERENCE
-- =====================================================

-- After creating the user, you can get their ID with:
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'mbagnickg@gmail.com';

-- =====================================================
-- 6. UPDATE ADMIN_USERS WITH CORRECT UUID
-- =====================================================

-- Once you have the user ID, update the admin_users table:
/*
UPDATE public.admin_users 
SET id = 'ACTUAL_USER_UUID_HERE'
WHERE email = 'mbagnickg@gmail.com';
*/

-- =====================================================
-- END OF USER CREATION SCRIPT
-- =====================================================

SELECT 'User creation script completed. Check the comments for next steps.' as status; 