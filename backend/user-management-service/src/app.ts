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

// Basic Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err }), // Show error details in dev
  });
});

export default app;