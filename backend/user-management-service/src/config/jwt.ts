// src/config/jwt.ts
import dotenv from 'dotenv';

dotenv.config();

// Ensure JWT_SECRET is explicitly a string and always has a value.
// It's critical for TypeScript to understand this is a string, not string | undefined.
export const JWT_SECRET: string = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_please_make_it_long_and_random';
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '1h';