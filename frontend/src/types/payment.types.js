/**
 * @typedef {Object} PaymentAttempt
 * @property {string} id - Unique payment attempt identifier
 * @property {string} orderId - Associated order identifier
 * @property {string} paymentMethod - Payment method used (e.g. "card", "upi", "cod")
 * @property {string} [paymentToken] - Optional payment token from payment provider
 * @property {string} status - Current status of the payment attempt ("success", "failure", "pending")
 * @property {number} amount - Payment amount in smallest currency unit (e.g. paise)
 * @property {string} [providerReference] - Reference identifier from the payment provider
 * @property {string} [failureReason] - Reason for failure if status is "failure"
 * @property {string} [providerResponse] - Raw response payload from the payment provider
 * @property {string} createdAt - ISO timestamp of when the attempt was created
 * @property {string} updatedAt - ISO timestamp of last update
 */

/**
 * @typedef {Object} PaymentOutcomeSuccess
 * @property {"success"} status - Outcome status indicating success
 * @property {string} orderId - Associated order identifier
 * @property {string} paymentAttemptId - Associated payment attempt identifier
 * @property {string} [providerReference] - Reference identifier from the payment provider
 * @property {number} amount - Amount paid in smallest currency unit (e.g. paise)
 * @property {string} paidAt - ISO timestamp of when payment was confirmed
 */

/**
 * @typedef {Object} PaymentOutcomeFailure
 * @property {"failure"} status - Outcome status indicating failure
 * @property {string} orderId - Associated order identifier
 * @property {string} paymentAttemptId - Associated payment attempt identifier
 * @property {string} failureReason - Human-readable reason for the payment failure
 * @property {string} [providerReference] - Reference identifier from the payment provider
 * @property {string} failedAt - ISO timestamp of when the failure was recorded
 */

/**
 * @typedef {Object} PaymentOutcomePending
 * @property {"pending"} status - Outcome status indicating the payment is still pending
 * @property {string} orderId - Associated order identifier
 * @property {string} paymentAttemptId - Associated payment attempt identifier
 * @property {string} [providerReference] - Reference identifier from the payment provider
 * @property {string} [redirectUrl] - URL to redirect the user to complete payment
 * @property {string} initiatedAt - ISO timestamp of when the payment was initiated
 */

/**
 * @typedef {PaymentOutcomeSuccess | PaymentOutcomeFailure | PaymentOutcomePending} PaymentOutcome
 */

export {};
