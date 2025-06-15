// src/app.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
// If you want to keep direct HTTP routes for testing/debugging, import them here
// import notificationRoutes from './routes/notificationRoutes';

dotenv.config();

const app: Application = express();

app.use(express.json());

// Health check endpoint (useful for Kubernetes probes)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'Notification Service is Up and Running!' });
});

// If you want to allow direct HTTP calls for sending notifications (e.g., for testing), uncomment this
// app.use('/api/notifications', notificationRoutes);


// Basic Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Something went wrong!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

export default app;