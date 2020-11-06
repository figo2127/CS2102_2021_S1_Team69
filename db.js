const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "root",
  host: process.env.DB_URL || "localhost",
  port: 5432,
  database: process.env.DB_NAME || "petcaringdb"
});

module.exports = pool;
