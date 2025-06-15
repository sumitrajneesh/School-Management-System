// src/consumers/notificationConsumer.ts
import { getChannel, NOTIFICATION_QUEUE } from '../config/rabbitmq';
import { resend, FROM_EMAIL } from '../config/resend';
import { twilioClient, twilioPhoneNumber } from '../config/twilio';
import { firebaseAdmin } from '../config/firebase';

// Define expected message types for clarity and type safety
interface EmailNotificationPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface SMSNotificationPayload {
  to: string;
  body: string;
}

interface PushNotificationPayload {
  deviceToken: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
}

// Union type for all possible notification messages
type NotificationMessage =
  | { type: 'email'; payload: EmailNotificationPayload }
  | { type: 'sms'; payload: SMSNotificationPayload }
  | { type: 'push'; payload: PushNotificationPayload };

// --- Internal Helper Functions to Send Notifications ---
// These are adapted from the previous controller functions to be callable directly
// without Express Request/Response objects.

const sendEmailDirect = async (payload: EmailNotificationPayload) => {
    const { to, subject, html, text } = payload;

    if (!resend || !FROM_EMAIL) {
        throw new Error('Email service not fully configured.');
    }

    try {
        const { data, error } = await resend.emails.send({
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            html: html,
            text: text,
        });

        if (error) {
            throw new Error(`Resend email error: ${error.message}`);
        }
        console.log(`Direct Email sent to ${to}: ${data?.id}`);
    } catch (error: any) {
        console.error('Error sending direct email:', error);
        throw error;
    }
};

const sendSmsDirect = async (payload: SMSNotificationPayload) => {
    const { to, body } = payload;

    if (!twilioClient || !twilioPhoneNumber) {
        throw new Error('Twilio service not fully configured.');
    }

    try {
        const message = await twilioClient.messages.create({
            body: body,
            from: twilioPhoneNumber,
            to: to,
        });
        console.log(`Direct SMS sent to ${to}: ${message.sid}`);
    } catch (error: any) {
        console.error('Error sending direct SMS:', error);
        throw error;
    }
};

const sendPushNotificationDirect = async (payload: PushNotificationPayload) => {
    const { deviceToken, title, body, data } = payload;

    if (!firebaseAdmin.apps.length) { // Check if Firebase Admin SDK is initialized
        throw new Error('Firebase Admin SDK not initialized for direct push sending.');
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: data || {}, // Optional custom data payload
        token: deviceToken, // The device token for the specific device
    };

    try {
        const response = await firebaseAdmin.messaging().send(message);
        console.log(`Direct Push Notification sent to ${deviceToken}: ${response}`);
    } catch (error: any) {
        console.error('Error sending direct push notification:', error);
        throw error;
    }
};


// Main consumer function
export const startNotificationConsumer = async () => {
  try {
    const channel = await getChannel();
    console.log(`[Notification Service] Waiting for messages in ${NOTIFICATION_QUEUE}. To exit press CTRL+C`);

    // Start consuming messages from the queue
    channel.consume(NOTIFICATION_QUEUE, async (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString()) as NotificationMessage;
        console.log(`[Notification Service] Received message: Type=${content.type}`);

        try {
          switch (content.type) {
            case 'email':
              await sendEmailDirect(content.payload as EmailNotificationPayload);
              break;
            case 'sms':
              await sendSmsDirect(content.payload as SMSNotificationPayload);
              break;
            case 'push':
              await sendPushNotificationDirect(content.payload as PushNotificationPayload);
              break;
            default:
              console.warn(`[Notification Service] Unknown notification type received: ${content.type}`);
          }
          channel.ack(msg); // Acknowledge the message if successfully processed
        } catch (error) {
          console.error(`[Notification Service] Error processing message type ${content.type}:`, error);
          // If message processing fails, nack the message.
          // `requeue: true` puts it back on the queue. For production, consider dead-letter queues.
          channel.nack(msg, false, true);
        }
      }
    }, {
      noAck: false // Important: We manually acknowledge messages
    });
  } catch (error) {
    console.error('[Notification Service] Failed to start consumer:', error);
    // In a production app, you might want to exit or implement a more robust retry logic
  }
};