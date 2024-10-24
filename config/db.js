const sql = require('mssql');
require('dotenv').config({ path: './.env.development' });

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true', // Konverterer 'true' fra .env til boolsk værdi
    },
};

async function getConnection() {
  try {
      const pool = await sql.connect(config);
      console.log("Database connection successful");
      return pool;
  } catch (error) {
      console.error('Database connection failed: ', error);
      console.error('Full error details: ', JSON.stringify(error, null, 2)); // Udskriver detaljerede fejl
      throw error;
  }
}

module.exports = { sql, getConnection };


