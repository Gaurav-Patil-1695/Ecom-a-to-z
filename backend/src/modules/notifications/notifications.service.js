import pool from '../../../db/pool.js';

/**
 * Retrieve all notifications for a user, ordered by most recent first.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getNotifications(userId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, type, title, body, data, is_read, created_at
     FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Retrieve a single notification by id, scoped to the requesting user.
 * @param {string} userId
 * @param {string} notificationId
 * @returns {Promise<Object>}
 */
export async function getNotificationById(userId, notificationId) {
  const { rows } = await pool.query(
    `SELECT id, user_id, type, title, body, data, is_read, created_at
     FROM notifications
     WHERE id = $1 AND user_id = $2`,
    [notificationId, userId]
  );
  if (rows.length === 0) {
    const err = new Error('Notification not found.');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

/**
 * Mark a single notification as read, scoped to the requesting user.
 * @param {string} userId
 * @param {string} notificationId
 * @returns {Promise<Object>}
 */
export async function markNotificationRead(userId, notificationId) {
  const { rows } = await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE id = $1 AND user_id = $2
     RETURNING id, user_id, type, title, body, data, is_read, created_at`,
    [notificationId, userId]
  );
  if (rows.length === 0) {
    const err = new Error('Notification not found.');
    err.status = 404;
    throw err;
  }
  return rows[0];
}

/**
 * Mark all notifications for a user as read.
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function markAllNotificationsRead(userId) {
  await pool.query(
    `UPDATE notifications
     SET is_read = true
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
}

/**
 * Get the count of unread notifications for a user.
 * @param {string} userId
 * @returns {Promise<number>}
 */
export async function getUnreadCount(userId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*) AS count
     FROM notifications
     WHERE user_id = $1 AND is_read = false`,
    [userId]
  );
  return parseInt(rows[0].count, 10);
}

/**
 * Create a notification for a user. Called by other services.
 * @param {Object} params
 * @param {string} params.userId
 * @param {string} params.type
 * @param {string} params.title
 * @param {string} params.body
 * @param {Object} [params.data]
 * @returns {Promise<Object>}
 */
export async function createNotification({ userId, type, title, body, data = null }) {
  const { rows } = await pool.query(
    `INSERT INTO notifications (user_id, type, title, body, data, is_read, created_at)
     VALUES ($1, $2, $3, $4, $5, false, NOW())
     RETURNING id, user_id, type, title, body, data, is_read, created_at`,
    [userId, type, title, body, data ? JSON.stringify(data) : null]
  );
  return rows[0];
}
