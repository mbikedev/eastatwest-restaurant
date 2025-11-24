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

-- Note: All indexes removed as they were unused on these small tables
-- Removed: idx_order_items_order_id, idx_order_items_product_id, idx_orders_created_at, idx_orders_customer_email, idx_orders_status
-- If tables grow significantly, consider adding composite indexes based on actual query patterns

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Orders are viewable by everyone" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Orders are insertable by everyone" ON orders
  FOR INSERT WITH CHECK (true);

-- Using (select auth.role()) for better query performance (avoids per-row re-evaluation)
CREATE POLICY "Orders are updatable by authenticated users" ON orders
  FOR UPDATE USING ((select auth.role()) = 'authenticated');

-- Create policies for order_items table
CREATE POLICY "Order items are viewable by everyone" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "Order items are insertable by everyone" ON order_items
  FOR INSERT WITH CHECK (true);

-- Using (select auth.role()) for better query performance (avoids per-row re-evaluation)
CREATE POLICY "Order items are updatable by authenticated users" ON order_items
  FOR UPDATE USING ((select auth.role()) = 'authenticated');

-- Create function to update updated_at timestamp (with secure search_path)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON orders 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 