# Create New User in Supabase Authentication

## User Details:
- **Name:** Mbagnick Gaye
- **Email:** mbagnickg@gmail.com
- **Phone:** +32496935745

## Method 1: Using Supabase Dashboard (Recommended)

### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: `fvsedygncxbpakjddxej`

### Step 2: Navigate to Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Users"** in the submenu

### Step 3: Create New User
1. Click the **"Add User"** button (usually in the top right)
2. Fill in the user details:
   - **Email:** `mbagnickg@gmail.com`
   - **Password:** (set a secure password)
   - **Email Confirm:** Check this box to auto-confirm the email
   - **User Metadata:** Add this JSON:
   ```json
   {
     "name": "Mbagnick Gaye",
     "phone": "+32496935745"
   }
   ```
3. Click **"Create User"**

### Step 4: Verify User Creation
1. The user should appear in the users list
2. Note the **User ID** (UUID) - you'll need this for admin access

## Method 2: Using Supabase Auth API

### JavaScript Code:
```javascript
// Using Supabase client
const { data, error } = await supabase.auth.admin.createUser({
  email: 'mbagnickg@gmail.com',
  password: 'your_secure_password',
  email_confirm: true,
  user_metadata: {
    name: 'Mbagnick Gaye',
    phone: '+32496935745'
  }
})

if (error) {
  console.error('Error creating user:', error)
} else {
  console.log('User created:', data.user)
}
```

## Method 3: SQL Approach (Advanced)

### Step 1: Create User in Auth
```sql
-- This is for reference only - use Dashboard method instead
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'mbagnickg@gmail.com',
  crypt('your_password_here', gen_salt('bf')),
  NOW(),
  '{"name": "Mbagnick Gaye", "phone": "+32496935745"}',
  NOW(),
  NOW()
);
```

### Step 2: Add to Admin Users (if you have the table)
```sql
-- Get the user ID first
SELECT id FROM auth.users WHERE email = 'mbagnickg@gmail.com';

-- Then add to admin_users table (replace USER_UUID with actual ID)
INSERT INTO public.admin_users (
  id,
  username,
  email,
  full_name,
  role,
  is_active
) VALUES (
  'USER_UUID_HERE', -- Replace with actual UUID
  'mbagnickg',
  'mbagnickg@gmail.com',
  'Mbagnick Gaye',
  'admin',
  true
);
```

## Verification Queries

### Check if user exists:
```sql
SELECT id, email, raw_user_meta_data, created_at
FROM auth.users 
WHERE email = 'mbagnickg@gmail.com';
```

### Check admin access:
```sql
SELECT * FROM public.admin_users 
WHERE email = 'mbagnickg@gmail.com';
```

## Next Steps

1. **Create the user** using the Dashboard method
2. **Note the User ID** (UUID)
3. **Test login** with the email and password
4. **Add to admin_users table** if you need admin access
5. **Update your application** to use the new user credentials

## Security Notes

- Use a **strong password** (12+ characters, mix of letters, numbers, symbols)
- **Enable 2FA** if available
- **Regular password updates** recommended
- **Monitor login activity** in the Dashboard

## Troubleshooting

### User not appearing:
- Check if the email is correct
- Verify the user was created successfully
- Check for any error messages

### Can't login:
- Verify the password is correct
- Check if email confirmation is required
- Try password reset if needed

### Admin access issues:
- Verify the user is in the admin_users table
- Check the role permissions
- Ensure the user ID matches between auth.users and admin_users 