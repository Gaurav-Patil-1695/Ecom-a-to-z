import db from '../../../db/index.js';
import { AppError } from '../../../utils/AppError.js';

const RETURNABLE_STATUSES = ['delivered'];
const RETURN_WINDOW_DAYS = 30;

/**
 * List all return requests (admin)
 */
export async function listReturnRequests({ status, page = 1, limit = 20 } = {}) {
  const offset = (Number(page) - 1) * Number(limit);
  const conditions = [];
  const values = [];

  if (status) {
    values.push(status);
    conditions.push(`rr.status = $${values.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) AS total FROM return_requests rr ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].total, 10);

  values.push(Number(limit));
  values.push(offset);

  const result = await db.query(
    `SELECT
       rr.id,
       rr.order_id,
       rr.user_id,
       rr.status,
       rr.reason,
       rr.comments,
       rr.items,
       rr.admin_note,
       rr.reviewed_by,
       rr.reviewed_at,
       rr.refund_id,
       rr.created_at,
       rr.updated_at
     FROM return_requests rr
     ${where}
     ORDER BY rr.created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return {
    data: result.rows,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

/**
 * Get a single return request by ID
 * Non-admin users can only access their own return requests
 */
export async function getReturnRequest(returnRequestId, userId, isAdmin) {
  const result = await db.query(
    `SELECT
       rr.id,
       rr.order_id,
       rr.user_id,
       rr.status,
       rr.reason,
       rr.comments,
       rr.items,
       rr.admin_note,
       rr.reviewed_by,
       rr.reviewed_at,
       rr.refund_id,
       rr.created_at,
       rr.updated_at
     FROM return_requests rr
     WHERE rr.id = $1`,
    [returnRequestId]
  );

  if (!result.rows.length) {
    throw new AppError('Return request not found.', 404);
  }

  const returnRequest = result.rows[0];

  if (!isAdmin && returnRequest.user_id !== userId) {
    throw new AppError('Access denied.', 403);
  }

  return returnRequest;
}

/**
 * Create a return request for an order
 */
export async function createReturnRequest(orderId, userId, { reason, items, comments }) {
  // Verify the order exists and belongs to the user
  const orderResult = await db.query(
    `SELECT id, user_id, status, delivered_at FROM orders WHERE id = $1`,
    [orderId]
  );

  if (!orderResult.rows.length) {
    throw new AppError('Order not found.', 404);
  }

  const order = orderResult.rows[0];

  if (order.user_id !== userId) {
    throw new AppError('Access denied.', 403);
  }

  // Check order is in a returnable status
  if (!RETURNABLE_STATUSES.includes(order.status)) {
    throw new AppError(
      `Only orders with status '${RETURNABLE_STATUSES.join(', ')}' can be returned.`,
      422
    );
  }

  // Check return window
  if (order.delivered_at) {
    const deliveredAt = new Date(order.delivered_at);
    const windowEnd = new Date(deliveredAt);
    windowEnd.setDate(windowEnd.getDate() + RETURN_WINDOW_DAYS);
    if (new Date() > windowEnd) {
      throw new AppError(
        `Return window of ${RETURN_WINDOW_DAYS} days has expired.`,
        422
      );
    }
  }

  // Check for existing pending/approved return request on this order
  const existingResult = await db.query(
    `SELECT id, status FROM return_requests WHERE order_id = $1 AND status IN ('pending', 'approved')`,
    [orderId]
  );

  if (existingResult.rows.length) {
    throw new AppError(
      'A return request for this order is already pending or approved.',
      409
    );
  }

  const insertResult = await db.query(
    `INSERT INTO return_requests
       (order_id, user_id, status, reason, items, comments, created_at, updated_at)
     VALUES ($1, $2, 'pending', $3, $4, $5, NOW(), NOW())
     RETURNING *`,
    [orderId, userId, reason, JSON.stringify(items || []), comments || null]
  );

  return insertResult.rows[0];
}

/**
 * Review (approve or reject) a return request
 * On approval: trigger refund and update stock
 */
export async function reviewReturnRequest(returnRequestId, { action, adminNote, adminId }) {
  const returnResult = await db.query(
    `SELECT * FROM return_requests WHERE id = $1`,
    [returnRequestId]
  );

  if (!returnResult.rows.length) {
    throw new AppError('Return request not found.', 404);
  }

  const returnRequest = returnResult.rows[0];

  if (returnRequest.status !== 'pending') {
    throw new AppError(
      `Return request has already been reviewed (status: ${returnRequest.status}).`,
      422
    );
  }

  const newStatus = action === 'approve' ? 'approved' : 'rejected';

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Update the return request status
    const updatedResult = await client.query(
      `UPDATE return_requests
       SET
         status = $1,
         admin_note = $2,
         reviewed_by = $3,
         reviewed_at = NOW(),
         updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [newStatus, adminNote || null, adminId, returnRequestId]
    );

    const updatedReturn = updatedResult.rows[0];

    if (action === 'approve') {
      // Trigger refund: fetch order payment details
      const orderResult = await client.query(
        `SELECT o.id, o.total_amount, o.currency, p.id AS payment_id, p.provider_transaction_id, p.provider
         FROM orders o
         LEFT JOIN payments p ON p.order_id = o.id AND p.status = 'success'
         WHERE o.id = $1
         LIMIT 1`,
        [returnRequest.order_id]
      );

      if (orderResult.rows.length && orderResult.rows[0].payment_id) {
        const orderPayment = orderResult.rows[0];

        // Insert refund record
        const refundResult = await client.query(
          `INSERT INTO refunds
             (order_id, payment_id, return_request_id, amount, currency, status, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, 'processing', NOW(), NOW())
           RETURNING id`,
          [
            returnRequest.order_id,
            orderPayment.payment_id,
            returnRequestId,
            orderPayment.total_amount,
            orderPayment.currency || 'INR',
          ]
        );

        const refundId = refundResult.rows[0].id;

        // Link refund to return request
        await client.query(
          `UPDATE return_requests SET refund_id = $1, updated_at = NOW() WHERE id = $2`,
          [refundId, returnRequestId]
        );

        updatedReturn.refund_id = refundId;
      }

      // Update stock: restore inventory for returned items
      const returnedItems = returnRequest.items;
      const items = Array.isArray(returnedItems)
        ? returnedItems
        : typeof returnedItems === 'string'
        ? JSON.parse(returnedItems)
        : [];

      for (const item of items) {
        if (item.sku_id && item.quantity) {
          await client.query(
            `UPDATE skus
             SET stock_quantity = stock_quantity + $1, updated_at = NOW()
             WHERE id = $2`,
            [item.quantity, item.sku_id]
          );
        }
      }

      // Update order status to 'returned'
      await client.query(
        `UPDATE orders SET status = 'returned', updated_at = NOW() WHERE id = $1`,
        [returnRequest.order_id]
      );
    }

    await client.query('COMMIT');
    return updatedReturn;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
