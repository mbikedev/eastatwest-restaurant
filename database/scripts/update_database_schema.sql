-- Update database schema for reservations table
-- Run this in your Supabase SQL editor

-- First, let's check what columns currently exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS invoice_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';

-- Add index for invoice_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_reservations_invoice_number ON public.reservations (invoice_number);

-- Add comment for new columns
COMMENT ON COLUMN public.reservations.invoice_number IS 'Unique invoice number for reservation tracking';
COMMENT ON COLUMN public.reservations.language IS 'Language used for reservation (en, fr, nl)';

-- Verify the changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'reservations' 
AND table_schema = 'public'
ORDER BY ordinal_position; 