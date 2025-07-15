import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import pool from './config/database';
import apiV1 from './api/v1';

dotenv.config();

const app: Express = express();

// Test DB connection on startup
(async () => {
  try {
    const client = await pool.connect();
    logger.info('Database connection test successful.');
    client.release(); // Release the client back to the pool
  } catch (err) {
    logger.error('Failed to connect to the database.', err);
    process.exit(1); // Exit the process with an error code
  }
})();





app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', apiV1);

const port = process.env.PORT || 3000;

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a welcome message.
 *     responses:
 *       200:
 *         description: A simple welcome message.
 */
app.get('/', (req: Request, res: Response) => {
  res.send('Lunoa Backend is running!');
});

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
