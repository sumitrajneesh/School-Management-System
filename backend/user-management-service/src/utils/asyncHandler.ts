// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express';

// Define a type for your async request handler
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>; // Changed to Promise<any> as it will always resolve or reject.

const asyncHandler = (fn: AsyncRequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;