const requiredEnvVars = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'JWT_SECRET',
];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Lipseste variabila de mediu obligatorie: ${key}`);
  }
});

module.exports = {
  port: Number(process.env.PORT) || 5000,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: Number(process.env.DB_PORT),
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  dbSsl: process.env.DB_SSL === 'true',
};