const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT),
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
});

const initDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS memes (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      filename    VARCHAR(255) NOT NULL,
      object_name VARCHAR(255) NOT NULL,
      url         TEXT NOT NULL,
      top_text    VARCHAR(255),
      bottom_text VARCHAR(255),
      created_at  TIMESTAMP DEFAULT NOW()
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('Table "memes" prête dans PostgreSQL');
  } catch (error) {
    console.error('Erreur initialisation PostgreSQL:', error.message);
    throw error;
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = { pool, query, initDatabase };