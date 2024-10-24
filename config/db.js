const sql = require('mssql');

const config = {
  user: 'GustavDegn',
  password: 'Lhddsba1357911',
  server: 'joe-main-server.database.windows.net',
  database: 'joe-database',
  options: {
    encrypt: true
  }
};

async function getConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Database connection failed: ", error);
    throw error;
  }
}

module.exports = {
  sql,
  getConnection
};

