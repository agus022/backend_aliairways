// db_connection.js
import pkg from 'pg';
import config from './config/config.js';

const { Pool } = pkg;

const pool = new Pool({
  host: config.APP_DB_HOST,
  user: config.APP_DB_USER,
  password: config.APP_DB_PASSWORD,
  database: config.APP_DB_NAME,
  port: config.APP_DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false // Si estás en RDS y usas SSL sin verificación estricta
  }
});

export default pool;
