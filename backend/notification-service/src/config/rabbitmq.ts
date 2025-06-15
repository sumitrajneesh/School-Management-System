// src/config/rabbitmq.ts
import amqp, { Channel, Connection } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
let connection: Connection | null = null;
let channel: Channel | null = null;

const NOTIFICATION_QUEUE = 'notification_requests'; // The queue this service will consume from

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ from Notification Service');

    // Assert the queue for consumption (ensure it exists)
    await channel.assertQueue(NOTIFICATION_QUEUE, { durable: true }); // durable: true makes the queue survive broker restarts
    console.log(`Asserted queue: ${NOTIFICATION_QUEUE}`);

    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      // Implement a reconnect strategy (e.g., exponential backoff)
    });

    connection.on('close', () => {
      console.log('RabbitMQ connection closed. Attempting to reconnect...');
      setTimeout(connectRabbitMQ, 5000); // Retry after 5 seconds
    });

    return { connection, channel };
  } catch (error) {
    console.error('Failed to connect to RabbitMQ from Notification Service:', error);
    // In a production app, you might want to exit the process or use a more robust retry mechanism
    throw error;
  }
};

const getChannel = async (): Promise<Channel> => {
  if (!channel) {
    await connectRabbitMQ();
  }
  if (!channel) {
    throw new Error('RabbitMQ channel not available');
  }
  return channel;
};

export { connectRabbitMQ, getChannel, NOTIFICATION_QUEUE };