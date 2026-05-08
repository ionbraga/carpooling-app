const { pool } = require('../config/db');

const createReview = async (reviewerId, reviewedUserId, rating, comment) => {
  const query = `
    INSERT INTO reviews (reviewer_id, reviewed_user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  const values = [reviewerId, reviewedUserId, rating, comment];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getReviewsForUser = async (userId) => {
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
    ORDER BY reviews.created_at DESC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

const findExistingReview = async (reviewerId, reviewedUserId) => {
  const query = `
    SELECT *
    FROM reviews
    WHERE reviewer_id = $1 AND reviewed_user_id = $2
    LIMIT 1;
  `;

  const result = await pool.query(query, [reviewerId, reviewedUserId]);
  return result.rows[0];
};

const findCompletedConfirmedRideWithDriver = async (passengerId, driverId) => {
  const query = `
    SELECT
      bookings.id AS booking_id,
      rides.id AS ride_id
    FROM bookings
    JOIN rides ON rides.id = bookings.ride_id
    WHERE bookings.user_id = $1
      AND rides.driver_id = $2
      AND bookings.status = 'confirmed'
      AND rides.status = 'active'
      AND rides.departure_time < (NOW() AT TIME ZONE 'Europe/Chisinau')
    LIMIT 1;
  `;

  const result = await pool.query(query, [passengerId, driverId]);
  return result.rows[0];
};

module.exports = {
  createReview,
  getReviewsForUser,
  findExistingReview,
  findCompletedConfirmedRideWithDriver,
};
