/**
 * @typedef {Object} ReturnRequest
 * @property {string} id - Unique return request identifier
 * @property {string} orderId - Associated order identifier
 * @property {string|null} userId - Associated user identifier, null for guest orders
 * @property {string} status - Current status of the return request
 * @property {string} reason - Reason provided for the return
 * @property {string} [comments] - Optional additional comments from the user
 * @property {string[]} [itemIds] - Array of order item identifiers being returned
 * @property {string} [reviewedBy] - Identifier of the admin who reviewed the request
 * @property {string} [reviewNote] - Note added by the reviewer
 * @property {string} [reviewedAt] - ISO timestamp of when the request was reviewed
 * @property {string} createdAt - ISO timestamp of when the return request was created
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} Refund
 * @property {string} id - Unique refund identifier
 * @property {string} orderId - Associated order identifier
 * @property {string} [returnRequestId] - Associated return request identifier, if applicable
 * @property {string} status - Current status of the refund (e.g. "pending", "processed", "failed")
 * @property {number} amount - Refund amount in smallest currency unit (e.g. paise)
 * @property {string} [paymentMethod] - Payment method through which refund is issued
 * @property {string} [providerReference] - Reference identifier from the payment provider
 * @property {string} [failureReason] - Reason for failure if status is "failed"
 * @property {string} [processedAt] - ISO timestamp of when the refund was processed
 * @property {string} createdAt - ISO timestamp of when the refund was created
 * @property {string} updatedAt - ISO timestamp of last update
 */

export {};
