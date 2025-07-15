import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../config/logger';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET is not defined for authentication middleware.');
      return res.status(500).json({ message: 'Internal server error: JWT secret not configured.' });
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    logger.error('Token verification failed:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
