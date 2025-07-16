import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

module.exports = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query('SELECT 1'); // Test the connection
    (global as any).__DB_POOL__ = pool;
    console.log('[GlobalSetup] Database pool created and connected.');
  } catch (error) {
    console.error('[GlobalSetup] Failed to connect to the database:', error);
    process.exit(1);
  }
};
