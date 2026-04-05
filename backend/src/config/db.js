const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  user: env.dbUser,
  host: env.dbHost,
  database: env.dbName,
  password: env.dbPassword,
  port: env.dbPort,
  ...(env.dbSsl
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

const query = (text, params) => pool.query(text, params);

const testConnection = async () => {
  await pool.query('SELECT NOW()');
  console.log('Conexiunea la baza de date a fost realizata cu succes.');
};

module.exports = {
  pool,
  query,
  testConnection,
};