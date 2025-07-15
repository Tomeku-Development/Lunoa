import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('Connected to the database');
});

pool.on('error', (err) => {
  logger.error('Database connection error', err);
  process.exit(-1);
});

export default pool;
