-- PL/pgSQL function to set reservation status based on guest count
CREATE OR REPLACE FUNCTION set_reservation_status() RETURNS trigger AS $$
BEGIN
  IF NEW.guest_count >= 7 THEN
     NEW.status := 'pending';
  ELSE
     NEW.status := 'approved';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to execute the function before INSERT on reservations table
CREATE TRIGGER trg_reservation_status
BEFORE INSERT ON reservations
FOR EACH ROW EXECUTE FUNCTION set_reservation_status();
