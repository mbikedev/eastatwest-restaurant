-- Complete setup for orders and order_items tables
-- Run this SQL in your Supabase SQL Editor (https://whixskigyxeligukorrm.supabase.co)

-- Drop existing tables if they exist (careful!)
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_type TEXT NOT NULL CHECK (delivery_type IN ('pickup', 'delivery')),
  delivery_address JSONB,
  delivery_date DATE NOT NULL,
  delivery_time TIME NOT NULL,
  additional_notes TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'payment_failed', 'canceled', 'completed')),
  payment_intent_id TEXT,
  payment_method TEXT DEFAULT 'online' CHECK (payment_method IN ('online', 'cash')),
  paid_at TIMESTAMP WITH TIME ZONE,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Orders are viewable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are insertable by everyone" ON orders;
DROP POLICY IF EXISTS "Orders are updatable by authenticated users" ON orders;
DROP POLICY IF EXISTS "Order items are viewable by everyone" ON order_items;
DROP POLICY IF EXISTS "Order items are insertable by everyone" ON order_items;
DROP POLICY IF EXISTS "Order items are updatable by authenticated users" ON order_items;

-- Create policies for orders table
CREATE POLICY "Orders are viewable by everyone" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Orders are insertable by everyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are updatable by authenticated users" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for order_items table
CREATE POLICY "Order items are viewable by everyone" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Order items are insertable by everyone" ON order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items are updatable by authenticated users" ON order_items
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments to document the schema
COMMENT ON TABLE orders IS 'Stores customer takeaway orders';
COMMENT ON TABLE order_items IS 'Stores individual items for each order';
COMMENT ON COLUMN orders.payment_method IS 'Payment method: online (Stripe) or cash (pay on pickup)';
COMMENT ON COLUMN orders.delivery_type IS 'Delivery type: pickup (customer collects) or delivery (delivered to address)';

-- Verify tables were created
SELECT
  table_name,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('orders', 'order_items')
ORDER BY table_name, ordinal_position;
