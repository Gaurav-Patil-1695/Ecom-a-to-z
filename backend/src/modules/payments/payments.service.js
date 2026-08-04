import db from '../../../db/index.js';
import { AppError } from '../../../utils/AppError.js';

// ---------------------------------------------------------------------------
// Adapter registry — extend this map to support additional providers
// ---------------------------------------------------------------------------
const adapterRegistry = {};

function getAdapter(provider) {
  const adapter = adapterRegistry[provider];
  if (!adapter) {
    throw new AppError(`Payment provider "${provider}" is not supported`, 400);
  }
  return adapter;
}

// ---------------------------------------------------------------------------
// Helper — persist / update a payment_attempt row
// ---------------------------------------------------------------------------
async function persistAttempt(data) {
  const {
    id,
    orderId,
    userId,
    provider,
    status,
    amount,
    currency,
    providerReference,
    providerPayload,
    errorMessage,
  } = data;

  if (id) {
    // Update existing attempt
    const [updated] = await db('payment_attempts')
      .where({ id })
      .update({
        status,
        provider_reference: providerReference || null,
        provider_payload: providerPayload ? JSON.stringify(providerPayload) : null,
        error_message: errorMessage || null,
        updated_at: db.fn.now(),
      })
      .returning('*');
    return updated;
  }

  // Insert new attempt
  const [created] = await db('payment_attempts')
    .insert({
      order_id: orderId,
      user_id: userId,
      provider,
      status: status || 'pending',
      amount,
      currency: currency || 'INR',
      provider_reference: providerReference || null,
      provider_payload: providerPayload ? JSON.stringify(providerPayload) : null,
      error_message: errorMessage || null,
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    })
    .returning('*');
  return created;
}

// ---------------------------------------------------------------------------
// Resolve active payment provider for an order
// ---------------------------------------------------------------------------
async function resolveProvider(orderId) {
  // The active provider can be stored in configuration or derived from the
  // order's payment_method. Fall back to the APP_PAYMENT_PROVIDER env variable.
  const envProvider = process.env.APP_PAYMENT_PROVIDER || 'razorpay';

  if (orderId) {
    const order = await db('orders').where({ id: orderId }).first();
    if (order && order.payment_provider) {
      return order.payment_provider;
    }
  }

  return envProvider;
}

// ---------------------------------------------------------------------------
// initiatePayment
// REQ-32 — Create a payment attempt and obtain a provider checkout session
// ---------------------------------------------------------------------------
export async function initiatePayment(body, user) {
  const { orderId, amount, currency = 'INR', paymentMethod } = body;

  if (!orderId) {
    throw new AppError('orderId is required', 400);
  }
  if (!amount || Number(amount) <= 0) {
    throw new AppError('A positive amount is required', 400);
  }

  const order = await db('orders').where({ id: orderId }).first();
  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Ensure the requesting user owns the order (non-admin)
  if (user && user.role !== 'admin' && String(order.user_id) !== String(user.id)) {
    throw new AppError('Forbidden', 403);
  }

  const provider = await resolveProvider(orderId);

  // Persist attempt with status=pending before hitting the provider
  const attempt = await persistAttempt({
    orderId,
    userId: user ? user.id : order.user_id,
    provider,
    status: 'pending',
    amount,
    currency,
  });

  // Delegate to provider adapter if registered; otherwise return a stub
  let providerResponse = null;
  if (adapterRegistry[provider]) {
    const adapter = getAdapter(provider);
    try {
      providerResponse = await adapter.createSession({
        attemptId: attempt.id,
        orderId,
        amount,
        currency,
        paymentMethod,
        user,
      });
      await persistAttempt({
        id: attempt.id,
        status: 'initiated',
        providerReference: providerResponse.reference,
        providerPayload: providerResponse,
      });
    } catch (adapterErr) {
      await persistAttempt({
        id: attempt.id,
        status: 'failed',
        errorMessage: adapterErr.message,
      });
      throw new AppError(`Payment initiation failed: ${adapterErr.message}`, 502);
    }
  } else {
    // No adapter registered — return attempt details so front-end can handle
    providerResponse = { provider, attemptId: attempt.id };
  }

  return {
    paymentId: attempt.id,
    status: providerResponse.reference ? 'initiated' : 'pending',
    provider,
    providerResponse,
  };
}

// ---------------------------------------------------------------------------
// getPayment
// REQ-32 — Retrieve a payment attempt by ID
// ---------------------------------------------------------------------------
export async function getPayment(paymentId, user) {
  const attempt = await db('payment_attempts').where({ id: paymentId }).first();
  if (!attempt) {
    throw new AppError('Payment attempt not found', 404);
  }

  // Authorisation — only the owning user or an admin may read
  if (user && user.role !== 'admin' && String(attempt.user_id) !== String(user.id)) {
    throw new AppError('Forbidden', 403);
  }

  return normaliseAttempt(attempt);
}

// ---------------------------------------------------------------------------
// handleCallback
// REQ-33 — Process provider webhook / callback and update attempt status
// ---------------------------------------------------------------------------
export async function handleCallback(body, headers) {
  // Determine provider from payload or a header hint
  const provider =
    (headers && headers['x-payment-provider']) ||
    (body && body.provider) ||
    process.env.APP_PAYMENT_PROVIDER ||
    'razorpay';

  let verified = false;
  let reference = null;
  let status = 'unknown';
  let attemptId = body.attemptId || body.attempt_id || null;

  if (adapterRegistry[provider]) {
    const adapter = getAdapter(provider);
    try {
      const result = await adapter.processCallback(body, headers);
      verified = result.verified;
      reference = result.reference;
      status = result.status;
      attemptId = result.attemptId || attemptId;
    } catch (adapterErr) {
      throw new AppError(`Callback processing failed: ${adapterErr.message}`, 502);
    }
  } else {
    // Without a registered adapter, accept the payload at face value
    verified = true;
    reference = body.reference || body.razorpay_payment_id || null;
    status = body.status || 'paid';
  }

  if (!attemptId) {
    // Try to locate the attempt by provider reference
    if (reference) {
      const found = await db('payment_attempts')
        .where({ provider_reference: reference })
        .first();
      if (found) attemptId = found.id;
    }
  }

  if (!attemptId) {
    throw new AppError('Unable to resolve payment attempt from callback payload', 422);
  }

  const normalStatus = mapProviderStatus(status);

  const updated = await persistAttempt({
    id: attemptId,
    status: normalStatus,
    providerReference: reference,
    providerPayload: body,
  });

  // Propagate status to the parent order
  if (updated && updated.order_id) {
    await syncOrderPaymentStatus(updated.order_id, normalStatus);
  }

  return { received: true, status: normalStatus, paymentId: attemptId };
}

// ---------------------------------------------------------------------------
// confirmPayment
// REQ-33 — Client-side confirmation (e.g. after 3-D Secure redirect)
// ---------------------------------------------------------------------------
export async function confirmPayment(paymentId, body, user) {
  const attempt = await db('payment_attempts').where({ id: paymentId }).first();
  if (!attempt) {
    throw new AppError('Payment attempt not found', 404);
  }

  if (user && user.role !== 'admin' && String(attempt.user_id) !== String(user.id)) {
    throw new AppError('Forbidden', 403);
  }

  if (['paid', 'refunded'].includes(attempt.status)) {
    throw new AppError('Payment is already in a terminal state', 409);
  }

  let newStatus = 'paid';
  let providerReference = attempt.provider_reference;

  if (adapterRegistry[attempt.provider]) {
    const adapter = getAdapter(attempt.provider);
    try {
      const result = await adapter.confirm({ attemptId: paymentId, body });
      newStatus = mapProviderStatus(result.status);
      providerReference = result.reference || providerReference;
    } catch (adapterErr) {
      await persistAttempt({
        id: paymentId,
        status: 'failed',
        errorMessage: adapterErr.message,
      });
      throw new AppError(`Payment confirmation failed: ${adapterErr.message}`, 502);
    }
  }

  const updated = await persistAttempt({
    id: paymentId,
    status: newStatus,
    providerReference,
    providerPayload: body,
  });

  if (updated && updated.order_id) {
    await syncOrderPaymentStatus(updated.order_id, newStatus);
  }

  return normaliseAttempt(updated);
}

// ---------------------------------------------------------------------------
// retryPayment
// REQ-34 — Retry a previously failed payment attempt
// ---------------------------------------------------------------------------
export async function retryPayment(paymentId, body, user) {
  const original = await db('payment_attempts').where({ id: paymentId }).first();
  if (!original) {
    throw new AppError('Payment attempt not found', 404);
  }

  if (user && user.role !== 'admin' && String(original.user_id) !== String(user.id)) {
    throw new AppError('Forbidden', 403);
  }

  if (['paid', 'refunded'].includes(original.status)) {
    throw new AppError('Cannot retry a payment that has already succeeded', 409);
  }

  const provider = await resolveProvider(original.order_id);

  // Create a new attempt linked to the same order
  const retryAttempt = await persistAttempt({
    orderId: original.order_id,
    userId: original.user_id,
    provider,
    status: 'pending',
    amount: body.amount || original.amount,
    currency: body.currency || original.currency || 'INR',
  });

  let providerResponse = null;
  if (adapterRegistry[provider]) {
    const adapter = getAdapter(provider);
    try {
      providerResponse = await adapter.createSession({
        attemptId: retryAttempt.id,
        orderId: original.order_id,
        amount: retryAttempt.amount,
        currency: retryAttempt.currency,
        user,
      });
      await persistAttempt({
        id: retryAttempt.id,
        status: 'initiated',
        providerReference: providerResponse.reference,
        providerPayload: providerResponse,
      });
    } catch (adapterErr) {
      await persistAttempt({
        id: retryAttempt.id,
        status: 'failed',
        errorMessage: adapterErr.message,
      });
      throw new AppError(`Payment retry failed: ${adapterErr.message}`, 502);
    }
  } else {
    providerResponse = { provider, attemptId: retryAttempt.id };
  }

  return {
    paymentId: retryAttempt.id,
    status: providerResponse.reference ? 'initiated' : 'pending',
    provider,
    providerResponse,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Map provider-specific status strings to our canonical set:
 * pending | initiated | paid | failed | refunded | unknown
 */
function mapProviderStatus(raw) {
  const s = (raw || '').toLowerCase();
  if (['captured', 'paid', 'success', 'succeeded', 'completed'].includes(s)) return 'paid';
  if (['failed', 'failure', 'declined', 'cancelled', 'canceled'].includes(s)) return 'failed';
  if (['refunded', 'reversed'].includes(s)) return 'refunded';
  if (['created', 'initiated', 'authorised', 'authorized'].includes(s)) return 'initiated';
  if (['pending', 'processing'].includes(s)) return 'pending';
  return 'unknown';
}

/**
 * Propagate payment status to the parent order's payment_status column (if it
 * exists). Errors are swallowed so that the primary operation still succeeds.
 */
async function syncOrderPaymentStatus(orderId, paymentStatus) {
  try {
    const orderPaymentStatus = paymentStatus === 'paid' ? 'paid' : paymentStatus;
    await db('orders').where({ id: orderId }).update({
      payment_status: orderPaymentStatus,
      updated_at: db.fn.now(),
    });
  } catch (_err) {
    // Non-critical — log but do not throw
    // eslint-disable-next-line no-console
    console.error('[payments.service] Failed to sync order payment status:', _err.message);
  }
}

/**
 * Normalise a raw DB row for API responses.
 */
function normaliseAttempt(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    provider: row.provider,
    status: row.status,
    amount: row.amount,
    currency: row.currency,
    providerReference: row.provider_reference,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Adapter registration (called by provider-specific adapter modules at boot)
// ---------------------------------------------------------------------------
export function registerAdapter(name, adapter) {
  if (!name || typeof adapter !== 'object') {
    throw new Error('registerAdapter requires a name string and an adapter object');
  }
  adapterRegistry[name] = adapter;
}
