// This file extends the Express Request type to include a 'user' property.

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
    };
  }
}
