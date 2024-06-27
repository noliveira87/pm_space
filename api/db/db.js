// api/db/db.js
const { Pool } = require('pg');
require('dotenv').config(); // Carrega variáveis de ambiente do arquivo .env

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
