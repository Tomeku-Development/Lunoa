import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import apiV1 from './api/v1';

dotenv.config();

export const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/v1', apiV1);

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
