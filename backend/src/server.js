require('dotenv').config();

const app = require('./app');
const env = require('./config/env');
const { testConnection } = require('./config/db');

const startServer = async () => {
  try {
    await testConnection();

    app.listen(env.port, () => {
      console.log(`Serverul ruleaza pe portul ${env.port}`);
    });
  } catch (error) {
    console.error('Serverul nu a putut porni:', error.message);
    process.exit(1);
  }
};

startServer();
