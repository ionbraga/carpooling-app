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

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
};
