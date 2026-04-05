const { pool } = require('../config/db');

const createRide = async (driverId, origin, destination, departureTime, availableSeats, price) => {
  const query = `
    INSERT INTO rides (driver_id, origin, destination, departure_time, available_seats, price)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [driverId, origin, destination, departureTime, availableSeats, price];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllRides = async (filters = {}) => {
  const conditions = [];
  const values = [];

  if (filters.origin) {
    values.push(`%${filters.origin}%`);
    conditions.push(`LOWER(rides.origin) LIKE LOWER($${values.length})`);
  }

  if (filters.destination) {
    values.push(`%${filters.destination}%`);
    conditions.push(`LOWER(rides.destination) LIKE LOWER($${values.length})`);
  }

  if (filters.onlyAvailable === true) {
    conditions.push('rides.available_seats > 0');
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      rides.id,
      rides.driver_id,
      rides.origin,
      rides.destination,
      rides.departure_time,
      rides.available_seats,
      rides.price,
      rides.created_at,
      users.name AS driver_name,
      users.email AS driver_email
    FROM rides
    JOIN users ON rides.driver_id = users.id
    ${whereClause}
    ORDER BY rides.departure_time ASC, rides.created_at DESC;
  `;

  const result = await pool.query(query, values);
  return result.rows;
};

const findRideById = async (rideId, client = pool) => {
  const query = `
    SELECT rides.*, users.name AS driver_name, users.email AS driver_email
    FROM rides
    JOIN users ON rides.driver_id = users.id
    WHERE rides.id = $1
    LIMIT 1;
  `;

  const result = await client.query(query, [rideId]);
  return result.rows[0];
};

const lockRideById = async (rideId, client) => {
  const query = `
    SELECT *
    FROM rides
    WHERE id = $1
    FOR UPDATE;
  `;

  const result = await client.query(query, [rideId]);
  return result.rows[0];
};

const updateAvailableSeats = async (rideId, availableSeats, client) => {
  const query = `
    UPDATE rides
    SET available_seats = $1
    WHERE id = $2
    RETURNING *;
  `;

  const result = await client.query(query, [availableSeats, rideId]);
  return result.rows[0];
};

module.exports = {
  createRide,
  getAllRides,
  findRideById,
  lockRideById,
  updateAvailableSeats,
};
