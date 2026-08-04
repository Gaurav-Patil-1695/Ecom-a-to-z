import PaymentAdapterInterface from './payment.adapter.interface.js';

/**
 * MockAdapter
 *
 * Test-mode payment adapter that returns configurable success/failure
 * responses without making any real network calls. Designed for use in
 * automated tests and local development.
 *
 * Configuration is read once at construction time from the options object
 * or falls back to environment variables:
 *
 *   MOCK_PAYMENT_INITIATE_SUCCESS  (default: 'true')
 *   MOCK_PAYMENT_VERIFY_STATUS     (default: 'SUCCESS')
 *   MOCK_PAYMENT_REFUND_SUCCESS    (default: 'true')
 *   MOCK_PAYMENT_WEBHOOK_STATUS    (default: 'SUCCESS')
 */
class MockAdapter extends PaymentAdapterInterface {
  /**
   * @param {Object} [options]
   * @param {boolean} [options.initiateSuccess]  - Whether initiatePayment should succeed.
   * @param {'PENDING'|'SUCCESS'|'FAILED'|'CANCELLED'} [options.verifyStatus] - Status returned by verifyPayment.
   * @param {boolean} [options.refundSuccess]    - Whether refundPayment should succeed.
   * @param {'PENDING'|'SUCCESS'|'FAILED'|'CANCELLED'} [options.webhookStatus] - Status returned by handleWebhook.
   * @param {string}  [options.errorMessage]     - Custom error message used when a method is configured to fail.
   */
  constructor(options = {}) {
    super();

    this._initiateSuccess =
      options.initiateSuccess !== undefined
        ? options.initiateSuccess
        : process.env.MOCK_PAYMENT_INITIATE_SUCCESS !== 'false';

    this._verifyStatus =
      options.verifyStatus ||
      process.env.MOCK_PAYMENT_VERIFY_STATUS ||
      'SUCCESS';

    this._refundSuccess =
      options.refundSuccess !== undefined
        ? options.refundSuccess
        : process.env.MOCK_PAYMENT_REFUND_SUCCESS !== 'false';

    this._webhookStatus =
      options.webhookStatus ||
      process.env.MOCK_PAYMENT_WEBHOOK_STATUS ||
      'SUCCESS';

    this._errorMessage =
      options.errorMessage || 'Mock payment adapter: simulated failure';
  }

  /**
   * Reconfigure the adapter at runtime (useful inside individual test cases).
   *
   * @param {Object} options - Same shape as the constructor options.
   */
  configure(options = {}) {
    if (options.initiateSuccess !== undefined) this._initiateSuccess = options.initiateSuccess;
    if (options.verifyStatus !== undefined) this._verifyStatus = options.verifyStatus;
    if (options.refundSuccess !== undefined) this._refundSuccess = options.refundSuccess;
    if (options.webhookStatus !== undefined) this._webhookStatus = options.webhookStatus;
    if (options.errorMessage !== undefined) this._errorMessage = options.errorMessage;
  }

  /**
   * @inheritdoc
   */
  async initiatePayment(params) {
    const { orderId, amount, currency } = params;

    if (!this._initiateSuccess) {
      throw new Error(this._errorMessage);
    }

    const providerOrderId = `mock_order_${orderId}`;
    const paymentUrl = `https://mock-payment-gateway.example.com/pay/${providerOrderId}`;

    return {
      providerOrderId,
      paymentUrl,
      providerPayload: {
        mock: true,
        orderId,
        amount,
        currency,
        providerOrderId,
        paymentUrl,
      },
    };
  }

  /**
   * @inheritdoc
   */
  async verifyPayment(params) {
    const { providerOrderId, providerPaymentId } = params;

    const resolvedPaymentId =
      providerPaymentId || `mock_pay_${providerOrderId}`;

    return {
      status: this._verifyStatus,
      providerPaymentId: resolvedPaymentId,
      providerPayload: {
        mock: true,
        providerOrderId,
        providerPaymentId: resolvedPaymentId,
        status: this._verifyStatus,
      },
    };
  }

  /**
   * @inheritdoc
   */
  async refundPayment(params) {
    const { providerPaymentId, amount, reason } = params;

    if (!this._refundSuccess) {
      throw new Error(this._errorMessage);
    }

    const providerRefundId = `mock_refund_${providerPaymentId}_${amount}`;

    return {
      providerRefundId,
      status: 'SUCCESS',
      providerPayload: {
        mock: true,
        providerPaymentId,
        providerRefundId,
        amount,
        reason: reason || null,
        status: 'SUCCESS',
      },
    };
  }

  /**
   * @inheritdoc
   */
  async handleWebhook(rawPayload, headers) {
    const orderId =
      (rawPayload && rawPayload.orderId) || 'mock_unknown_order';
    const providerOrderId =
      (rawPayload && rawPayload.providerOrderId) || `mock_order_${orderId}`;
    const providerPaymentId =
      (rawPayload && rawPayload.providerPaymentId) ||
      `mock_pay_${providerOrderId}`;

    return {
      orderId,
      providerOrderId,
      providerPaymentId,
      status: this._webhookStatus,
      providerPayload: {
        mock: true,
        orderId,
        providerOrderId,
        providerPaymentId,
        status: this._webhookStatus,
        receivedPayload: rawPayload,
        receivedHeaders: headers,
      },
    };
  }
}

export default MockAdapter;
