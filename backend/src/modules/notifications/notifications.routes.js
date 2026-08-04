import { Router } from 'express';
import {
  getNotifications,
  getNotificationById,
  markNotificationRead,
  markAllNotificationsRead,
} from './notifications.controller.js';

const router = Router();

router.get('/', getNotifications);
router.get('/:notificationId', getNotificationById);
router.post('/:notificationId/read', markNotificationRead);
router.post('/read-all', markAllNotificationsRead);

export default router;
