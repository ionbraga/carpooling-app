ALTER TABLE rides
DROP CONSTRAINT IF EXISTS rides_available_seats_check;

ALTER TABLE rides
ADD CONSTRAINT rides_available_seats_check
CHECK (available_seats >= 0);