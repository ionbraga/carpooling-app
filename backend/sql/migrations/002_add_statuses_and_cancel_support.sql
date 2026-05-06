ALTER TABLE rides
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';

ALTER TABLE rides
DROP CONSTRAINT IF EXISTS rides_status_check;

ALTER TABLE rides
ADD CONSTRAINT rides_status_check
CHECK (status IN ('active', 'cancelled'));

ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_unique_user_ride;

ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings
ADD CONSTRAINT bookings_status_check
CHECK (status IN ('confirmed', 'cancelled'));

CREATE UNIQUE INDEX IF NOT EXISTS bookings_unique_confirmed_user_ride
ON bookings (user_id, ride_id)
WHERE status = 'confirmed';