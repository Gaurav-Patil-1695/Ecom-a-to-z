import pool from '../../../db/pool.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

function assertFound(row, message = 'Order not found') {
  if (!row) {
    const err = new Error(message);
    err.status = 404;
    throw err;
  }
}

function assertAuthorized(order, userId, role) {
  if (role === 'admin') return;
  if (order.user_id !== userId) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}

function forbidden(message = 'Forbidden') {
  const err = new Error(message);
  err.status = 403;
  throw err;
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  throw err;
}

// ─── Status transition map ───────────────────────────────────────────────────

const ALLOWED_TRANSITIONS = {
  pending:     ['confirmed', 'cancelled'],
  confirmed:   ['processing', 'cancelled'],
  processing:  ['shipped', 'cancelled'],
  shipped:     ['delivered'],
  delivered:   [],
  cancelled:   [],
  returned:    [],
};

const CANCELLABLE_STATUSES = new Set(['pending', 'confirmed', 'processing']);

// ─── Order creation (called by checkout) ────────────────────────────────────

export async function createOrderService({
  userId,
  addressId,
  items,
  promoCodeId,
  subtotal,
  discountAmount,
  shippingAmount,
  taxAmount,
  totalAmount,
  paymentMethod,
  notes,
}, client) {
  const ownConnection = !client;
  if (ownConnection) client = await pool.connect();

  try {
    if (ownConnection) await client.query('BEGIN');

    const orderRes = await client.query(
      `INSERT INTO orders
         (user_id, address_id, promo_code_id, status,
          subtotal, discount_amount, shipping_amount, tax_amount, total_amount,
          payment_method, notes)
       VALUES ($1,$2,$3,'pending',$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [
        userId,
        addressId,
        promoCodeId ?? null,
        subtotal,
        discountAmount ?? 0,
        shippingAmount ?? 0,
        taxAmount ?? 0,
        totalAmount,
        paymentMethod,
        notes ?? null,
      ],
    );
    const order = orderRes.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items
           (order_id, sku_id, product_id, quantity, unit_price, total_price)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          order.id,
          item.skuId,
          item.productId,
          item.quantity,
          item.unitPrice,
          item.totalPrice,
        ],
      );
    }

    await _writeStatusHistory(client, order.id, null, 'pending', 'Order created');

    await client.query(
      `INSERT INTO order_tracking (order_id, status, description)
       VALUES ($1,'pending','Order placed successfully')`,
      [order.id],
    );

    if (ownConnection) await client.query('COMMIT');
    return order;
  } catch (err) {
    if (ownConnection) await client.query('ROLLBACK');
    throw err;
  } finally {
    if (ownConnection) client.release();
  }
}

// ─── List orders ─────────────────────────────────────────────────────────────

export async function listOrdersService({ userId, role, page, limit, status, sort }) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  const params = [];
  const conditions = [];

  if (role !== 'admin') {
    params.push(userId);
    conditions.push(`o.user_id = $${params.length}`);
  }

  if (status) {
    params.push(status);
    conditions.push(`o.status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortField = sort === 'total_amount' ? 'o.total_amount' : 'o.created_at';
  const sortDir = 'DESC';

  params.push(limitNum, offset);
  const dataQuery = `
    SELECT o.*, u.email AS user_email
    FROM orders o
    LEFT JOIN users u ON u.id = o.user_id
    ${where}
    ORDER BY ${sortField} ${sortDir}
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const countParams = params.slice(0, params.length - 2);
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM orders o
    ${where}
  `;

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, params),
    pool.query(countQuery, countParams),
  ]);

  return {
    data: dataRes.rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: parseInt(countRes.rows[0].total, 10),
    },
  };
}

// ─── Get single order ─────────────────────────────────────────────────────────

export async function getOrderService({ orderId, userId, role }) {
  const orderRes = await pool.query(
    `SELECT o.*, u.email AS user_email
     FROM orders o
     LEFT JOIN users u ON u.id = o.user_id
     WHERE o.id = $1`,
    [orderId],
  );
  const order = orderRes.rows[0];
  assertFound(order);
  assertAuthorized(order, userId, role);

  const itemsRes = await pool.query(
    `SELECT oi.*, p.name AS product_name, s.sku_code
     FROM order_items oi
     LEFT JOIN products p ON p.id = oi.product_id
     LEFT JOIN skus s ON s.id = oi.sku_id
     WHERE oi.order_id = $1
     ORDER BY oi.id`,
    [orderId],
  );

  return { ...order, items: itemsRes.rows };
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export async function getOrderTimelineService({ orderId, userId, role }) {
  const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRes.rows[0];
  assertFound(order);
  assertAuthorized(order, userId, role);

  const histRes = await pool.query(
    `SELECT * FROM order_status_history
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId],
  );

  return { orderId, timeline: histRes.rows };
}

// ─── Tracking ─────────────────────────────────────────────────────────────────

export async function getOrderTrackingService({ orderId, userId, role }) {
  const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRes.rows[0];
  assertFound(order);
  assertAuthorized(order, userId, role);

  const trackRes = await pool.query(
    `SELECT * FROM order_tracking
     WHERE order_id = $1
     ORDER BY created_at ASC`,
    [orderId],
  );

  return { orderId, tracking: trackRes.rows };
}

// ─── Refunds ──────────────────────────────────────────────────────────────────

export async function getOrderRefundsService({ orderId, userId, role }) {
  const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
  const order = orderRes.rows[0];
  assertFound(order);
  assertAuthorized(order, userId, role);

  const refundRes = await pool.query(
    `SELECT * FROM refunds
     WHERE order_id = $1
     ORDER BY created_at DESC`,
    [orderId],
  );

  return { orderId, refunds: refundRes.rows };
}

// ─── Cancel order ─────────────────────────────────────────────────────────────

export async function cancelOrderService({ orderId, userId, role, reason }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    const order = orderRes.rows[0];
    assertFound(order);
    assertAuthorized(order, userId, role);

    if (!CANCELLABLE_STATUSES.has(order.status)) {
      badRequest(`Order cannot be cancelled in status: ${order.status}`);
    }

    const previousStatus = order.status;

    await client.query(
      `UPDATE orders SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [orderId],
    );

    await _writeStatusHistory(client, orderId, previousStatus, 'cancelled', reason ?? 'Cancelled by user');

    await client.query(
      `INSERT INTO order_tracking (order_id, status, description)
       VALUES ($1,'cancelled',$2)`,
      [orderId, reason ?? 'Order cancelled'],
    );

    await client.query('COMMIT');
    const updated = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    return updated.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Advance order ────────────────────────────────────────────────────────────

export async function advanceOrderService({ orderId, userId, role, status: targetStatus }) {
  if (role !== 'admin') {
    forbidden('Only admins can advance order status');
  }

  if (!targetStatus) {
    badRequest('Target status is required');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    const order = orderRes.rows[0];
    assertFound(order);

    const allowed = ALLOWED_TRANSITIONS[order.status] ?? [];
    if (!allowed.includes(targetStatus)) {
      badRequest(
        `Cannot transition order from '${order.status}' to '${targetStatus}'`,
      );
    }

    const previousStatus = order.status;

    await client.query(
      `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`,
      [targetStatus, orderId],
    );

    await _writeStatusHistory(client, orderId, previousStatus, targetStatus, `Status advanced to ${targetStatus}`);

    await client.query(
      `INSERT INTO order_tracking (order_id, status, description)
       VALUES ($1,$2,$3)`,
      [orderId, targetStatus, `Order ${targetStatus}`],
    );

    await client.query('COMMIT');
    const updated = await pool.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    return updated.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Create return request ────────────────────────────────────────────────────

export async function createReturnRequestService({ orderId, userId, role, payload }) {
  const { reason, items } = payload;

  if (!reason) {
    badRequest('Return reason is required');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const orderRes = await client.query('SELECT * FROM orders WHERE id = $1 FOR UPDATE', [orderId]);
    const order = orderRes.rows[0];
    assertFound(order);
    assertAuthorized(order, userId, role);

    if (order.status !== 'delivered') {
      badRequest('Return requests can only be created for delivered orders');
    }

    const existingRes = await client.query(
      `SELECT id FROM return_requests
       WHERE order_id = $1 AND status NOT IN ('rejected','closed')`,
      [orderId],
    );
    if (existingRes.rows.length > 0) {
      badRequest('An active return request already exists for this order');
    }

    const rrRes = await client.query(
      `INSERT INTO return_requests (order_id, user_id, reason, status)
       VALUES ($1,$2,$3,'pending')
       RETURNING *`,
      [orderId, userId, reason],
    );
    const returnRequest = rrRes.rows[0];

    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO return_request_items (return_request_id, order_item_id, quantity)
           VALUES ($1,$2,$3)`,
          [returnRequest.id, item.orderItemId, item.quantity],
        );
      }
    }

    await _writeStatusHistory(
      client,
      orderId,
      order.status,
      'return_requested',
      `Return request created: ${reason}`,
    );

    await client.query(
      `INSERT INTO order_tracking (order_id, status, description)
       VALUES ($1,'return_requested','Return request submitted')`,
      [orderId],
    );

    await client.query('COMMIT');
    return returnRequest;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// ─── Internal: write to order_status_history ─────────────────────────────────

async function _writeStatusHistory(client, orderId, fromStatus, toStatus, note) {
  await client.query(
    `INSERT INTO order_status_history (order_id, from_status, to_status, note)
     VALUES ($1,$2,$3,$4)`,
    [orderId, fromStatus ?? null, toStatus, note ?? null],
  );
}
