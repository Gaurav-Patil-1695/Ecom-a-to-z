/**
 * @typedef {Object} Notification
 * @property {string} id - Unique notification identifier
 * @property {string|null} userId - Associated user identifier, null if broadcast
 * @property {string} type - Notification type (e.g. "order_update", "promo", "return_update")
 * @property {string} title - Notification title
 * @property {string} message - Notification message body
 * @property {boolean} isRead - Whether the notification has been read by the user
 * @property {string|null} [referenceId] - Identifier of the related entity (e.g. orderId, returnRequestId)
 * @property {string|null} [referenceType] - Type of the related entity (e.g. "order", "return_request")
 * @property {string} createdAt - ISO timestamp of when the notification was created
 * @property {string} updatedAt - ISO timestamp of last update
 */

export {};
