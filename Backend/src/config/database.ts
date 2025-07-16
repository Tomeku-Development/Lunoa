import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

let pool: Pool;

export const getPool = (): Pool => {
  if (pool) {
    return pool;
  }

  if (process.env.NODE_ENV === 'test' && (global as any).__DB_POOL__) {
    pool = (global as any).__DB_POOL__;
    return pool;
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  pool.on('connect', () => {
    logger.info('Connected to the database');
  });

  pool.on('error', (err) => {
    logger.error('Database connection error', err);
    process.exit(-1);
  });

  return pool;
};
