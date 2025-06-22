// src/middlewares/roleMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: ('student' | 'teacher' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      // For synchronous middleware, you can return a response directly
      // or call next(new Error(...)) if you want to use the global error handler
      return res.status(403).json({ message: `User role ${req.user?.role} is not authorized to access this route` });
    }
    next();
  };
};