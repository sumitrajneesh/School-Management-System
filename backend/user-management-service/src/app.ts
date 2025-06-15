// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import connectDB from './config/db';

dotenv.config();

const app: Application = express();

// Connect to database
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'User Management Service is Up and Running!' });
});

// Route Mounts
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Basic Error Handling Middleware (must be after all routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Log the full stack trace for debugging purposes

  // If a status code was already set by a controller (e.g., res.status(400)), use it.
  // Otherwise, default to 500 (Internal Server Error).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
    // Only show stack trace in development environment for security
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

export default app;