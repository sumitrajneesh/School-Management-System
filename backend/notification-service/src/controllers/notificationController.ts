// src/controllers/notificationController.ts
// NOTE: These functions are primarily for direct HTTP calls (e.g., for testing).
// The main notification logic is now handled by the RabbitMQ consumer calling internal send functions.

import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler'; // Assuming you have an asyncHandler utility
import { resend, FROM_EMAIL } from '../config/resend';
import { twilioClient, twilioPhoneNumber } from '../config/twilio';
import { firebaseAdmin } from '../config/firebase';

// @desc    Send an email notification via HTTP
// @route   POST /api/notifications/email
// @access  Private (e.g., for testing or internal admin tools)
export const sendEmail = asyncHandler(async (req: Request, res: Response) => {
  const { to, subject, html, text } = req.body;

  if (!to || (!html && !text) || !subject) {
    res.status(400);
    throw new Error('Missing required fields for email: to, subject, and either html or text');
  }
  if (!resend || !FROM_EMAIL) {
    res.status(500);
    throw new Error('Email service not fully configured.');
  }

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: to,
    subject: subject,
    html: html,
    text: text,
  });

  if (error) {
    console.error('Error sending email via Resend (HTTP):', error);
    res.status(error.statusCode || 500);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  res.status(200).json({ message: 'Email sent successfully via HTTP', emailId: data?.id });
});

// @desc    Send an SMS notification via HTTP
// @route   POST /api/notifications/sms
// @access  Private
export const sendSms = asyncHandler(async (req: Request, res: Response) => {
  const { to, body } = req.body;

  if (!to || !body) {
    res.status(400);
    throw new Error('Missing required fields for SMS: to (phone number), body');
  }
  if (!twilioClient || !twilioPhoneNumber) {
    res.status(500);
    throw new Error('Twilio service not fully configured.');
  }

  const message = await twilioClient.messages.create({
    body: body,
    from: twilioPhoneNumber,
    to: to,
  });

  res.status(200).json({ message: 'SMS sent successfully via HTTP', sid: message.sid });
});

// @desc    Send a Push Notification (FCM) via HTTP
// @route   POST /api/notifications/push
// @access  Private
export const sendPushNotification = asyncHandler(async (req: Request, res: Response) => {
  const { deviceToken, title, body, data } = req.body;

  if (!deviceToken || !title || !body) {
    res.status(400);
    throw new Error('Missing required fields for Push Notification: deviceToken, title, body');
  }
  if (!firebaseAdmin.apps.length) {
    res.status(500);
    throw new Error('Firebase Admin SDK not initialized for push sending.');
  }

  const message = {
    notification: { title, body },
    data: data || {},
    token: deviceToken,
  };

  const response = await firebaseAdmin.messaging().send(message);
  res.status(200).json({ message: 'Push notification sent successfully via HTTP', response });
});