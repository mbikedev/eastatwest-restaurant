-- =====================================================
-- Simple Database Setup for East at West Restaurant
-- Matches the current form structure exactly
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. RESERVATIONS TABLE (matches your form exactly)
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
  status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. INDEXES FOR PERFORMANCE
-- =====================================================

-- Reservations indexes
CREATE INDEX IF NOT EXISTS idx_reservations_date ON public.reservations (date);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON public.reservations (email);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations (status);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations (created_at);

-- Cancellation requests indexes
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_reservation_id ON public.cancellation_requests (reservation_id);
CREATE INDEX IF NOT EXISTS idx_cancellation_requests_status ON public.cancellation_requests (request_status);

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_requests ENABLE ROW LEVEL SECURITY;

-- Reservations policies - allow public insert and select
CREATE POLICY "public_insert_reservations" ON public.reservations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_reservations" ON public.reservations
  FOR SELECT USING (true);

-- Cancellation requests policies
CREATE POLICY "public_insert_cancellation_requests" ON public.cancellation_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_select_cancellation_requests" ON public.cancellation_requests
  FOR SELECT USING (true);

-- =====================================================
-- 5. TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- 6. CREATE TRIGGERS
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

-- =====================================================
-- 7. COMMENTS
-- =====================================================

COMMENT ON TABLE public.reservations IS 'Store restaurant reservations for East at West';
COMMENT ON COLUMN public.reservations.status IS 'Reservation status: pending (for 7+ guests), confirmed, cancelled';
COMMENT ON COLUMN public.reservations.guests IS 'Number of guests (1-22, 7+ requires approval)';

COMMENT ON TABLE public.cancellation_requests IS 'Store cancellation requests from customers';
COMMENT ON COLUMN public.cancellation_requests.request_status IS 'Request status: pending, approved, rejected';

-- =====================================================
-- 8. SUCCESS MESSAGE
-- =====================================================

SELECT 'Simple database setup completed successfully!' as status; 