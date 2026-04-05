const { pool } = require('../config/db');

const createBooking = async (userId, rideId, seatsBooked, status = 'confirmed', client = pool) => {
  const query = `
    INSERT INTO bookings (user_id, ride_id, seats_booked, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [userId, rideId, seatsBooked, status];
  const result = await client.query(query, values);
  return result.rows[0];
};

const findExistingUserBookingForRide = async (userId, rideId, client = pool) => {
  const query = `
    SELECT *
    FROM bookings
    WHERE user_id = $1 AND ride_id = $2 AND status = 'confirmed'
    LIMIT 1;
  `;

  const result = await client.query(query, [userId, rideId]);
  return result.rows[0];
};

const getUserBookings = async (userId) => {
  const query = `
    SELECT
      bookings.id,
      bookings.user_id,
      bookings.ride_id,
      bookings.seats_booked,
      bookings.status,
      bookings.created_at,
      rides.origin,
      rides.destination,
      rides.departure_time,
      rides.price,
      rides.driver_id,
      users.name AS driver_name,
      users.email AS driver_email
    FROM bookings
    JOIN rides ON bookings.ride_id = rides.id
    JOIN users ON rides.driver_id = users.id
    WHERE bookings.user_id = $1
    ORDER BY bookings.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createBooking,
  findExistingUserBookingForRide,
  getUserBookings,
};
