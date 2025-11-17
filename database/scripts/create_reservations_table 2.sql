-- Create the reservations table for East at West restaurant
-- Run this in your Supabase SQL Editor

-- Create enum for reservation status
CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create the reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a restaurant booking system)
-- Allow anyone to insert reservations
CREATE POLICY "Allow public to create reservations" ON reservations
  FOR INSERT WITH CHECK (true);

-- Allow anyone to view reservations (for admin purposes)
CREATE POLICY "Allow public to view reservations" ON reservations
  FOR SELECT USING (true);

-- Allow updates to reservations (for admin to change status)
CREATE POLICY "Allow public to update reservations" ON reservations
  FOR UPDATE USING (true);

-- Create an index on date for better performance
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);

-- Create an index on email for customer lookups
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);

-- Insert a test reservation to verify the table works
INSERT INTO reservations (name, email, phone, date, start_time, end_time, guests, special_requests)
VALUES (
  'Test Customer',
  'test@example.com',
  '+1234567890',
  CURRENT_DATE + INTERVAL '1 day',
  '18:00',
  '20:00',
  2,
  'Test reservation'
) ON CONFLICT DO NOTHING;

-- Verify the table was created
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'reservations'
ORDER BY ordinal_position; 