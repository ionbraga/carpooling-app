const { Pool, types } = require('pg');
const env = require('./env');

// PostgreSQL TIMESTAMP WITHOUT TIME ZONE are OID 1114.
// Îl păstrăm ca string local, nu îl transformăm în Date cu UTC.
const TIMESTAMP_WITHOUT_TIME_ZONE_OID = 1114;

types.setTypeParser(TIMESTAMP_WITHOUT_TIME_ZONE_OID, (value) =>
  value
    .replace(' ', 'T')
    .replace(/(\.\d{3})\d+$/, '$1')
);

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