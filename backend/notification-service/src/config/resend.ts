// src/config/resend.ts
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL;

if (!RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined. Email sending might fail.');
}
if (!FROM_EMAIL) {
  console.warn('FROM_EMAIL is not defined. Email sending might fail.');
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export { resend, FROM_EMAIL };