// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken'; // <--- Import Secret
import { JWT_SECRET } from '../config/jwt';
import User, { IUser } from '../models/User';
import asyncHandler from '../utils/asyncHandler'; // <--- Import asyncHandler

// Extend the Request interface to include the user property
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser; // Make user optional
  }
}

interface JwtPayload {
  id: string;
}

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET as Secret) as JwtPayload; // <--- Cast JWT_SECRET and type decoded

      // Attach user to the request (without password)
      const foundUser = await User.findById(decoded.id).select('-password');
      if (!foundUser) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      req.user = foundUser as IUser; // <--- Explicitly cast to IUser

      next(); // Call next() only if successful
    } catch (error: any) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});