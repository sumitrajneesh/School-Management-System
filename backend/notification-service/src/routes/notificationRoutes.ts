// src/routes/notificationRoutes.ts
import { Router } from 'express';
import { sendEmail, sendSms, sendPushNotification } from '../controllers/notificationController';

const router = Router();

router.post('/email', sendEmail);
router.post('/sms', sendSms);
router.post('/push', sendPushNotification);

export default router;