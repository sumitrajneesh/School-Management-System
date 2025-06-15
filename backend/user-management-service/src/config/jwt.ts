import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_please_change_me';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';