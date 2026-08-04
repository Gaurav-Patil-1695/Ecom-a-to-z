import * as notificationsService from './notifications.service.js';

export async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await notificationsService.getNotifications(userId);
    res.status(200).json({ notifications });
  } catch (err) {
    next(err);
  }
}

export async function getNotificationById(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.getNotificationById(userId, notificationId);
    res.status(200).json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { notificationId } = req.params;
    const notification = await notificationsService.markNotificationRead(userId, notificationId);
    res.status(200).json({ notification });
  } catch (err) {
    next(err);
  }
}

export async function markAllNotificationsRead(req, res, next) {
  try {
    const userId = req.user.id;
    await notificationsService.markAllNotificationsRead(userId);
    res.status(200).json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
}
