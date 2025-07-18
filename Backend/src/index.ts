import { app } from './app';
import logger from './config/logger';
import { getPool } from './config/database';

const port = process.env.PORT || 3000;

const server = app.listen(port, async () => {
  try {
    // Test DB connection on startup
        const client = await getPool().connect();
    logger.info('Database connection test successful.');
    client.release();
    logger.info(`Server is running at http://localhost:${port}`);
  } catch (err) {
    logger.error('Failed to connect to the database on startup.', err);
    process.exit(1);
  }
});

export { server };
                