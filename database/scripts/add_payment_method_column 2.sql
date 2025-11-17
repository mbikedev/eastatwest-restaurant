-- Add payment_method column to orders table
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online' CHECK (payment_method IN ('online', 'cash'));

-- Add comment to document the column
COMMENT ON COLUMN orders.payment_method IS 'Payment method: online (Stripe) or cash (pay on pickup)';

-- Verify the column was added
SELECT column_name, data_type, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' AND column_name = 'payment_method';
