-- Add payment_method column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'online' CHECK (payment_method IN ('online', 'cash'));

-- Add comment to document the column
COMMENT ON COLUMN orders.payment_method IS 'Payment method: online (Stripe) or cash (pay on pickup)';
