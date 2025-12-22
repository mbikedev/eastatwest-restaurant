-- Holiday Management System Migration
-- Creates the holidays table for managing restaurant closures
-- Supports single dates, date ranges, and recurring holidays

-- Create the holidays table
CREATE TABLE IF NOT EXISTS public.holidays (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Holiday identification
  name VARCHAR(255) NOT NULL,
  description TEXT,
  notes TEXT, -- Internal notes for staff, not shown to customers

  -- Date handling (single date when start_date = end_date)
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Recurrence configuration
  -- Example: {"type": "annual", "month": 12, "day": 25} for Christmas
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  recurrence_end_date DATE, -- Optional: when to stop generating recurring instances

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- Email of admin who created it

  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date),
  CONSTRAINT valid_recurrence CHECK (
    (is_recurring = false) OR
    (is_recurring = true AND recurrence_pattern IS NOT NULL)
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_holidays_date_range ON public.holidays (start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_holidays_is_active ON public.holidays (is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_holidays_is_recurring ON public.holidays (is_recurring) WHERE is_recurring = true;

-- Enable Row Level Security
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "service_role_holidays" ON public.holidays;
DROP POLICY IF EXISTS "public_read_active_holidays" ON public.holidays;

-- Policy: Allow service role full access (for admin operations)
CREATE POLICY "service_role_holidays"
ON public.holidays
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Public can only read active holidays
CREATE POLICY "public_read_active_holidays"
ON public.holidays
FOR SELECT
TO public
USING (is_active = true);

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION update_holidays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS holidays_updated_at ON public.holidays;

-- Create trigger for auto-updating updated_at field
CREATE TRIGGER holidays_updated_at
BEFORE UPDATE ON public.holidays
FOR EACH ROW
EXECUTE FUNCTION update_holidays_updated_at();

-- Create RPC function to check if a specific date is a holiday
CREATE OR REPLACE FUNCTION check_date_is_holiday(check_date DATE)
RETURNS TABLE (
  is_holiday BOOLEAN,
  holiday_id UUID,
  holiday_name VARCHAR(255),
  message TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH matching_holidays AS (
    -- Check for direct date range matches (non-recurring holidays)
    SELECT
      h.id,
      h.name,
      'The restaurant is closed for ' || h.name || '.' AS msg
    FROM public.holidays h
    WHERE h.is_active = true
      AND check_date BETWEEN h.start_date AND h.end_date
      AND h.is_recurring = false

    UNION

    -- Check for recurring annual holidays
    SELECT
      h.id,
      h.name,
      'The restaurant is closed for ' || h.name || '.' AS msg
    FROM public.holidays h
    WHERE h.is_active = true
      AND h.is_recurring = true
      AND h.recurrence_pattern->>'type' = 'annual'
      AND EXTRACT(MONTH FROM check_date)::INT = (h.recurrence_pattern->>'month')::INT
      AND EXTRACT(DAY FROM check_date)::INT = (h.recurrence_pattern->>'day')::INT
      AND (h.recurrence_end_date IS NULL OR check_date <= h.recurrence_end_date)
  )
  SELECT
    CASE WHEN COUNT(*) > 0 THEN true ELSE false END,
    (SELECT id FROM matching_holidays LIMIT 1),
    (SELECT name FROM matching_holidays LIMIT 1),
    (SELECT msg FROM matching_holidays LIMIT 1)
  FROM matching_holidays;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (Christmas 2025 as recurring annual holiday)
INSERT INTO public.holidays (name, description, start_date, end_date, is_recurring, recurrence_pattern, is_active)
VALUES
  ('Christmas', 'Annual Christmas closure', '2025-12-25', '2025-12-25', true, '{"type": "annual", "month": 12, "day": 25}'::jsonb, true),
  ('New Year''s Day', 'Annual New Year''s Day closure', '2026-01-01', '2026-01-01', true, '{"type": "annual", "month": 1, "day": 1}'::jsonb, true)
ON CONFLICT DO NOTHING;

-- Verification queries (run these after migration to verify)
-- SELECT * FROM public.holidays;
-- SELECT * FROM check_date_is_holiday('2025-12-25');
-- SELECT * FROM check_date_is_holiday('2026-12-25');
-- SELECT * FROM check_date_is_holiday('2027-01-01');
