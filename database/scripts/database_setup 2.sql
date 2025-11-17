-- =====================================================
-- East at West Restaurant Database Setup
-- Complete SQL script for reservations and cancellations
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. RESERVATIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0 AND guests <= 22),
  special_requests TEXT,
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  table_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. CANCELLATION REQUESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cancellation_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  cancellation_reason TEXT,
  request_status VARCHAR(50) DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  processed_by UUID, -- admin user ID
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. ADMIN USERS TABLE (for staff management)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. TABLES TABLE (for restaurant table management)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_number INTEGER UNIQUE NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  location VARCHAR(100), -- e.g., 'patio', 'indoor', 'window'
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. INDEXES FOR PERFORMANCE
-- =====================================================

-- Reservations indexes
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations (date);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations (email);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations (status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations (created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON public.reservations (date, start_time);

-- Cancellation requests indexes
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_reservation_id ON public.cancellation_requests (reservation_id);
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_status ON public.cancellation_requests (request_status);
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_created_at ON public.cancellation_requests (created_at);

-- Admin users indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users (email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users (role);

-- Restaurant tables indexes
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_number ON public.restaurant_tables (table_number);
CREATE INDEX IF NOT EXISTS idx_restaurant_tables_available ON public.restaurant_tables (is_available);

-- =====================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;

-- Reservations policies
CREATE POLICY "public_insert_reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_reservations" ON public.reservations
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_reservations" ON public.reservations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Cancellation requests policies
CREATE POLICY "public_insert_cancellation_requests" ON public.cancellation_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_cancellation_requests" ON public.cancellation_requests
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_cancellation_requests" ON public.cancellation_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- Admin users policies (only admins can manage admin users)
CREATE POLICY "admin_manage_admin_users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.role = 'admin'
      AND admin_users.is_active = true
    )
  );

-- Restaurant tables policies
CREATE POLICY "public_select_restaurant_tables" ON public.restaurant_tables
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_restaurant_tables" ON public.restaurant_tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.id = auth.uid() 
      AND admin_users.is_active = true
    )
  );

-- =====================================================
-- 7. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle reservation status updates
CREATE OR REPLACE FUNCTION handle_reservation_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- If reservation is cancelled, update related cancellation request
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.cancellation_requests 
    SET request_status = 'approved', 
        processed_at = NOW(),
        updated_at = NOW()
    WHERE reservation_id = NEW.id 
    AND request_status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to check table availability
CREATE OR REPLACE FUNCTION check_table_availability(
  reservation_date DATE,
  start_time TIME,
  end_time TIME,
  table_number INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  conflicting_reservations INTEGER;
BEGIN
  SELECT COUNT(*) INTO conflicting_reservations
  FROM public.reservations
  WHERE date = reservation_date
    AND table_number = check_table_availability.table_number
    AND status IN ('confirmed', 'pending')
    AND (
      (start_time < check_table_availability.end_time AND end_time > check_table_availability.start_time)
    );
  
  RETURN conflicting_reservations = 0;
END;
$$ language 'plpgsql';

-- =====================================================
-- 8. CREATE TRIGGERS
-- =====================================================

-- Update timestamps triggers
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancellation_requests_updated_at
  BEFORE UPDATE ON public.cancellation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_tables_updated_at
  BEFORE UPDATE ON public.restaurant_tables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Reservation status update trigger
CREATE TRIGGER handle_reservation_status_update_trigger
  AFTER UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION handle_reservation_status_update();

-- =====================================================
-- 9. INSERT SAMPLE DATA
-- =====================================================

-- Insert sample admin users
INSERT INTO public.admin_users (username, email, full_name, role) VALUES
('admin', 'admin@eastatwest.com', 'System Administrator', 'admin'),
('manager', 'manager@eastatwest.com', 'Restaurant Manager', 'manager'),
('staff1', 'staff1@eastatwest.com', 'Server Staff', 'staff')
ON CONFLICT (username) DO NOTHING;

-- Insert sample restaurant tables
INSERT INTO public.restaurant_tables (table_number, capacity, location) VALUES
(1, 2, 'window'),
(2, 4, 'indoor'),
(3, 6, 'patio'),
(4, 8, 'indoor'),
(5, 4, 'window'),
(6, 2, 'patio'),
(7, 10, 'private'),
(8, 4, 'indoor')
ON CONFLICT (table_number) DO NOTHING;

-- =====================================================
-- 10. COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.reservations IS 'Store restaurant reservations for East at West';
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled, completed';
COMMENT ON COLUMN public.reservations.guests IS 'Number of guests (1-22, 7+ requires approval)';
COMMENT ON COLUMN public.reservations.table_number IS 'Assigned table number (optional)';

COMMENT ON TABLE public.cancellation_requests IS 'Store cancellation requests from customers';
COMMENT ON COLUMN public.cancellation_requests.request_status IS 'Request status: pending, approved, rejected';

COMMENT ON TABLE public.admin_users IS 'Store admin users for staff management';
COMMENT ON COLUMN public.admin_users.role IS 'User role: admin, manager, staff';

COMMENT ON TABLE public.restaurant_tables IS 'Store restaurant table information';
COMMENT ON COLUMN public.restaurant_tables.location IS 'Table location: patio, indoor, window, private';

-- =====================================================
-- 11. VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for today's reservations
CREATE OR REPLACE VIEW today_reservations AS
SELECT 
  r.id,
  r.name,
  r.email,
  r.phone,
  r.date,
  r.start_time,
  r.end_time,
  r.guests,
  r.status,
  r.table_number,
  rt.location as table_location
FROM public.reservations r
LEFT JOIN public.restaurant_tables rt ON r.table_number = rt.table_number
WHERE r.date = CURRENT_DATE
ORDER BY r.start_time;

-- View for pending cancellation requests
CREATE OR REPLACE VIEW pending_cancellations AS
SELECT 
  cr.id,
  cr.customer_name,
  cr.customer_email,
  cr.customer_phone,
  cr.cancellation_reason,
  cr.created_at as request_date,
  r.date as reservation_date,
  r.start_time,
  r.guests
FROM public.cancellation_requests cr
JOIN public.reservations r ON cr.reservation_id = r.id
WHERE cr.request_status = 'pending'
ORDER BY cr.created_at DESC;

-- =====================================================
-- END OF DATABASE SETUP
-- =====================================================

-- Success message
SELECT 'Database setup completed successfully!' as status; 