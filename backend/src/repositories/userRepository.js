const { pool } = require('../config/db');

const createUser = async (name, email, password) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;

  const values = [name, email, password];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT id, name, email, password, created_at
    FROM users
    WHERE LOWER(email) = LOWER($1)
    LIMIT 1;
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0];
};

const findUserById = async (userId) => {
  const query = `
    SELECT id, name, email, created_at
    FROM users
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

const findUserByIdWithPassword = async (userId) => {
  const query = `
    SELECT id, name, email, password, created_at
    FROM users
    WHERE id = $1
    LIMIT 1;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

const updateUserName = async (userId, name) => {
  const query = `
    UPDATE users
    SET name = $1
    WHERE id = $2
    RETURNING id, name, email, created_at;
  `;

  const result = await pool.query(query, [name, userId]);
  return result.rows[0];
};

const updateUserPassword = async (userId, hashedPassword) => {
  const query = `
    UPDATE users
    SET password = $1
    WHERE id = $2
    RETURNING id, name, email, created_at;
  `;

  const result = await pool.query(query, [hashedPassword, userId]);
  return result.rows[0];
};

const getUserProfileStats = async (userId) => {
  const query = `
    SELECT
      (
        SELECT COUNT(*)
        FROM rides
        WHERE driver_id = $1
      ) AS published_rides_count,

      (
        SELECT COUNT(*)
        FROM rides
        WHERE driver_id = $1
          AND status = 'active'
          AND departure_time >= (NOW() AT TIME ZONE 'Europe/Chisinau')
      ) AS active_rides_count,

      (
        SELECT COUNT(*)
        FROM bookings
        WHERE user_id = $1
      ) AS bookings_count,

      (
        SELECT COUNT(*)
        FROM bookings b
        JOIN rides r ON r.id = b.ride_id
        WHERE b.user_id = $1
          AND b.status = 'confirmed'
          AND r.status = 'active'
          AND r.departure_time >= (NOW() AT TIME ZONE 'Europe/Chisinau')
      ) AS active_bookings_count,

      (
        SELECT COUNT(*)
        FROM reviews
        WHERE reviewed_user_id = $1
      ) AS reviews_received_count,

      (
        SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
        FROM reviews
        WHERE reviewed_user_id = $1
      ) AS average_rating;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

const getRecentReviewsForUser = async (userId) => {
  const query = `
    SELECT
      reviews.id,
      reviews.reviewer_id,
      reviews.reviewed_user_id,
      reviews.rating,
      reviews.comment,
      reviews.created_at,
      users.name AS reviewer_name,
      users.email AS reviewer_email
    FROM reviews
    JOIN users ON reviews.reviewer_id = users.id
    WHERE reviews.reviewed_user_id = $1
    ORDER BY reviews.created_at DESC
    LIMIT 5;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  updateUserName,
  updateUserPassword,
  getUserProfileStats,
  getRecentReviewsForUser,
};