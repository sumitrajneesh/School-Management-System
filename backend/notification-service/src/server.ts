// src/server.ts
import app from './app';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './config/rabbitmq';
import { startNotificationConsumer } from './consumers/notificationConsumer';

dotenv.config();

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
  // Connect to RabbitMQ and start the message consumer when the server starts
  connectRabbitMQ()
    .then(() => startNotificationConsumer())
    .catch(err => {
      console.error("Failed to connect to RabbitMQ or start consumer on startup:", err);
      // In a production app, you might want to exit the process or implement a retry mechanism
    });
});