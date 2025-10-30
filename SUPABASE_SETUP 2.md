# Supabase Setup Guide

This guide will help you set up Supabase for your East at West restaurant application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `east-at-west-restaurant`
   - Database Password: (create a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key

## 3. Set Up Environment Variables

Create a `.env.local` file in your project root and add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## 4. Create Database Tables

Run the following SQL in your Supabase SQL Editor:

### Users Table (extends Supabase auth)
```sql
-- Create a custom type for user roles
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Create profiles table that extends auth.users
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Reservations Table
```sql
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');

CREATE TABLE reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  special_requests TEXT,
  status reservation_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reservations" ON reservations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reservations" ON reservations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reservations" ON reservations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all reservations" ON reservations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
  category TEXT NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies (menu items are public)
CREATE POLICY "Anyone can view available menu items" ON menu_items
  FOR SELECT USING (available = true);

CREATE POLICY "Admins can manage menu items" ON menu_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 5. Set Up Storage Buckets

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `restaurant-images`
3. Set it to public
4. Create the following storage policies:

```sql
-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'restaurant-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'restaurant-images' 
    AND auth.role() = 'authenticated'
  );

-- Allow admins to manage images
CREATE POLICY "Admins can manage images" ON storage.objects
  FOR ALL USING (
    bucket_id = 'restaurant-images' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

## 6. Test the Connection

1. Start your development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. Try creating a reservation to test the database connection

## 7. Optional: Set Up Email Templates

1. Go to Authentication → Email Templates in Supabase
2. Customize the email templates for:
   - Confirmation emails
   - Magic link emails
   - Password reset emails

## 8. Environment Variables for Production

When deploying to production, make sure to set these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
```

## 9. Security Best Practices

1. **Row Level Security (RLS)**: All tables have RLS enabled
2. **Environment Variables**: Never commit your `.env.local` file
3. **API Keys**: Use the anon key for client-side operations
4. **User Roles**: Implement proper role-based access control
5. **Input Validation**: Always validate user input before database operations

## 10. Troubleshooting

### Common Issues:

1. **"Module not found" errors**: Make sure you've installed `@supabase/supabase-js` and `@supabase/ssr`
2. **Authentication errors**: Check your environment variables are correct
3. **RLS policy errors**: Verify your policies are correctly configured
4. **CORS errors**: Check your Supabase project settings

### Useful Commands:

```bash
# Install Supabase CLI (optional)
npm install -g supabase

# Generate types from your database
supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

## 11. Next Steps

1. Implement user authentication in your app
2. Connect the reservation form to Supabase
3. Create an admin dashboard for managing reservations
4. Add menu management functionality
5. Implement image upload for menu items

For more information, visit the [Supabase documentation](https://supabase.com/docs). 