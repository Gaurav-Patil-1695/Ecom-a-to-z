/**
 * PaymentAdapterInterface
 *
 * Duck-type contract that all payment provider adapters must satisfy.
 * Concrete adapters should extend this class (or at minimum implement
 * every method defined here) and override each method with provider-
 * specific logic.
 *
 * Method signatures match the usage expected by payments.service.js.
 */
class PaymentAdapterInterface {
  /**
   * Initiate a payment session with the provider.
   *
   * @param {Object} params
   * @param {string} params.orderId        - Internal order identifier.
   * @param {number} params.amount         - Amount in the smallest currency unit (e.g. paise / cents).
   * @param {string} params.currency       - ISO 4217 currency code (e.g. "INR", "USD").
   * @param {string} params.customerEmail  - Customer e-mail address.
   * @param {string} params.customerPhone  - Customer phone number.
   * @param {string} params.callbackUrl    - URL the provider should redirect / post back to.
   * @param {Object} [params.metadata]     - Arbitrary key-value pairs forwarded to the provider.
   *
   * @returns {Promise<{
   *   providerOrderId: string,
   *   paymentUrl:      string,
   *   providerPayload: Object
   * }>}
   */
  async initiatePayment(params) {
    throw new Error('PaymentAdapterInterface.initiatePayment() must be implemented by subclass');
  }

  /**
   * Verify the status of a payment with the provider.
   *
   * @param {Object} params
   * @param {string} params.providerOrderId  - Provider-side order / session identifier.
   * @param {string} params.providerPaymentId - Provider-side payment identifier (may be undefined
   *                                            before the payment is complete).
   *
   * @returns {Promise<{
   *   status:          'PENDING'|'SUCCESS'|'FAILED'|'CANCELLED',
   *   providerPaymentId: string,
   *   providerPayload: Object
   * }>}
   */
  async verifyPayment(params) {
    throw new Error('PaymentAdapterInterface.verifyPayment() must be implemented by subclass');
  }

  /**
   * Process a refund for a previously captured payment.
   *
   * @param {Object} params
   * @param {string} params.providerPaymentId - Provider-side payment identifier.
   * @param {number} params.amount            - Amount to refund (smallest currency unit).
   * @param {string} [params.reason]          - Human-readable reason for the refund.
   *
   * @returns {Promise<{
   *   providerRefundId: string,
   *   status:           'PENDING'|'SUCCESS'|'FAILED',
   *   providerPayload:  Object
   * }>}
   */
  async refundPayment(params) {
    throw new Error('PaymentAdapterInterface.refundPayment() must be implemented by subclass');
  }

  /**
   * Handle and validate an inbound webhook / callback payload from the provider.
   *
   * @param {Object} rawPayload  - The raw request body as received from the provider.
   * @param {Object} headers     - HTTP headers from the provider request (used for signature verification).
   *
   * @returns {Promise<{
   *   orderId:          string,
   *   providerOrderId:  string,
   *   providerPaymentId: string,
   *   status:           'PENDING'|'SUCCESS'|'FAILED'|'CANCELLED',
   *   providerPayload:  Object
   * }>}
   */
  async handleWebhook(rawPayload, headers) {
    throw new Error('PaymentAdapterInterface.handleWebhook() must be implemented by subclass');
  }
}

export default PaymentAdapterInterface;
