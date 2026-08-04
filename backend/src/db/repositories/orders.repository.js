import db from '../client.js';

const ORDERS_TABLE = 'orders';
const ITEMS_TABLE = 'order_items';
const STATUS_HISTORY_TABLE = 'order_status_history';
const TRACKING_TABLE = 'order_tracking';

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function findById(id) {
  return db(ORDERS_TABLE).where({ id }).first();
}

export async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByUserId(userId) {
  const [{ total }] = await db(ORDERS_TABLE)
    .where({ user_id: userId })
    .count('id as total');
  return Number(total);
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function count() {
  const [{ total }] = await db(ORDERS_TABLE).count('id as total');
  return Number(total);
}

export async function create(data, trx = db) {
  const [id] = await trx(ORDERS_TABLE).insert(data);
  return trx(ORDERS_TABLE).where({ id }).first();
}

export async function update(id, data, trx = db) {
  await trx(ORDERS_TABLE).where({ id }).update(data);
  return trx(ORDERS_TABLE).where({ id }).first();
}

export async function updateStatus(id, status, trx = db) {
  await trx(ORDERS_TABLE).where({ id }).update({ status });
  return trx(ORDERS_TABLE).where({ id }).first();
}

export async function remove(id) {
  return db(ORDERS_TABLE).where({ id }).delete();
}

export async function findByStatus(status, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ status })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByStatus(status) {
  const [{ total }] = await db(ORDERS_TABLE)
    .where({ status })
    .count('id as total');
  return Number(total);
}

export async function findWithDetails(id) {
  const order = await db(ORDERS_TABLE)
    .select(
      `${ORDERS_TABLE}.*`,
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name',
      'promo_codes.code as promo_code'
    )
    .leftJoin('users', `${ORDERS_TABLE}.user_id`, 'users.id')
    .leftJoin('promo_codes', `${ORDERS_TABLE}.promo_code_id`, 'promo_codes.id')
    .where(`${ORDERS_TABLE}.id`, id)
    .first();
  if (!order) return null;
  const items = await findItemsByOrderId(id);
  return { ...order, items };
}

export async function findByIdAndUserId(id, userId) {
  return db(ORDERS_TABLE).where({ id, user_id: userId }).first();
}

export async function findByIdAndUserIdWithDetails(id, userId) {
  const order = await db(ORDERS_TABLE)
    .select(
      `${ORDERS_TABLE}.*`,
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name',
      'promo_codes.code as promo_code'
    )
    .leftJoin('users', `${ORDERS_TABLE}.user_id`, 'users.id')
    .leftJoin('promo_codes', `${ORDERS_TABLE}.promo_code_id`, 'promo_codes.id')
    .where(`${ORDERS_TABLE}.id`, id)
    .where(`${ORDERS_TABLE}.user_id`, userId)
    .first();
  if (!order) return null;
  const items = await findItemsByOrderId(id);
  return { ...order, items };
}

export async function findByPromoCodeId(promoCodeId, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where({ promo_code_id: promoCodeId })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findAllWithDetails({ limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .select(
      `${ORDERS_TABLE}.*`,
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name',
      'promo_codes.code as promo_code'
    )
    .leftJoin('users', `${ORDERS_TABLE}.user_id`, 'users.id')
    .leftJoin('promo_codes', `${ORDERS_TABLE}.promo_code_id`, 'promo_codes.id')
    .orderBy(`${ORDERS_TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function findByUserIdWithDetails(userId, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .select(
      `${ORDERS_TABLE}.*`,
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name',
      'promo_codes.code as promo_code'
    )
    .leftJoin('users', `${ORDERS_TABLE}.user_id`, 'users.id')
    .leftJoin('promo_codes', `${ORDERS_TABLE}.promo_code_id`, 'promo_codes.id')
    .where(`${ORDERS_TABLE}.user_id`, userId)
    .orderBy(`${ORDERS_TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function search(query, { limit = 20, offset = 0 } = {}) {
  return db(ORDERS_TABLE)
    .where('id', 'like', `%${query}%`)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

// ---------------------------------------------------------------------------
// Order Items
// ---------------------------------------------------------------------------

export async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

export async function findItemsByOrderId(orderId) {
  return db(ITEMS_TABLE).where({ order_id: orderId }).select('*');
}

export async function findItemsByOrderIdWithSku(orderId) {
  return db(ITEMS_TABLE)
    .select(
      `${ITEMS_TABLE}.*`,
      'skus.sku as sku_code',
      'products.name as product_name',
      'products.slug as product_slug'
    )
    .where(`${ITEMS_TABLE}.order_id`, orderId)
    .leftJoin('skus', `${ITEMS_TABLE}.sku_id`, 'skus.id')
    .leftJoin('products', 'skus.product_id', 'products.id');
}

export async function findItemByIdAndOrderId(id, orderId) {
  return db(ITEMS_TABLE).where({ id, order_id: orderId }).first();
}

export async function countItemsByOrderId(orderId) {
  const [{ total }] = await db(ITEMS_TABLE)
    .where({ order_id: orderId })
    .count('id as total');
  return Number(total);
}

export async function addItem(data, trx = db) {
  const [id] = await trx(ITEMS_TABLE).insert(data);
  return trx(ITEMS_TABLE).where({ id }).first();
}

export async function addItems(items, trx = db) {
  await trx(ITEMS_TABLE).insert(items);
}

export async function updateItem(id, data) {
  await db(ITEMS_TABLE).where({ id }).update(data);
  return findItemById(id);
}

export async function removeItem(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

export async function removeItemsByOrderId(orderId, trx = db) {
  return trx(ITEMS_TABLE).where({ order_id: orderId }).delete();
}

// ---------------------------------------------------------------------------
// Order Status History
// ---------------------------------------------------------------------------

export async function findStatusHistoryById(id) {
  return db(STATUS_HISTORY_TABLE).where({ id }).first();
}

export async function findStatusHistoryByOrderId(orderId) {
  return db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'asc')
    .select('*');
}

export async function addStatusHistory(data, trx = db) {
  const [id] = await trx(STATUS_HISTORY_TABLE).insert(data);
  return trx(STATUS_HISTORY_TABLE).where({ id }).first();
}

export async function findLatestStatusHistory(orderId) {
  return db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'desc')
    .first();
}

export async function countStatusHistoryByOrderId(orderId) {
  const [{ total }] = await db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId })
    .count('id as total');
  return Number(total);
}

export async function findStatusHistoryByStatus(orderId, status) {
  return db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId, status })
    .orderBy('created_at', 'asc')
    .select('*');
}

// ---------------------------------------------------------------------------
// Order Tracking
// ---------------------------------------------------------------------------

export async function findTrackingById(id) {
  return db(TRACKING_TABLE).where({ id }).first();
}

export async function findTrackingByOrderId(orderId) {
  return db(TRACKING_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function findLatestTrackingByOrderId(orderId) {
  return db(TRACKING_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'desc')
    .first();
}

export async function addTracking(data, trx = db) {
  const [id] = await trx(TRACKING_TABLE).insert(data);
  return trx(TRACKING_TABLE).where({ id }).first();
}

export async function updateTracking(id, data) {
  await db(TRACKING_TABLE).where({ id }).update(data);
  return findTrackingById(id);
}

export async function updateTrackingByOrderId(orderId, data) {
  await db(TRACKING_TABLE).where({ order_id: orderId }).update(data);
  return findLatestTrackingByOrderId(orderId);
}

export async function removeTracking(id) {
  return db(TRACKING_TABLE).where({ id }).delete();
}

export async function findTrackingByCarrier(carrier, { limit = 20, offset = 0 } = {}) {
  return db(TRACKING_TABLE)
    .where({ carrier })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findTrackingByTrackingNumber(trackingNumber) {
  return db(TRACKING_TABLE).where({ tracking_number: trackingNumber }).first();
}

// ---------------------------------------------------------------------------
// Compound / transactional helpers
// ---------------------------------------------------------------------------

/**
 * Create a full order with items and initial status history in one transaction.
 */
export async function createOrderWithItems(orderData, items, initialStatus) {
  return db.transaction(async (trx) => {
    const [orderId] = await trx(ORDERS_TABLE).insert(orderData);
    const orderItems = items.map((item) => ({ ...item, order_id: orderId }));
    if (orderItems.length > 0) {
      await trx(ITEMS_TABLE).insert(orderItems);
    }
    if (initialStatus) {
      await trx(STATUS_HISTORY_TABLE).insert({
        order_id: orderId,
        status: initialStatus.status,
        note: initialStatus.note || null,
        created_by: initialStatus.created_by || null,
      });
    }
    return trx(ORDERS_TABLE).where({ id: orderId }).first();
  });
}

/**
 * Advance order status: update order status and append a status history entry.
 */
export async function advanceStatus(orderId, status, note = null, createdBy = null) {
  return db.transaction(async (trx) => {
    await trx(ORDERS_TABLE).where({ id: orderId }).update({ status });
    await trx(STATUS_HISTORY_TABLE).insert({
      order_id: orderId,
      status,
      note,
      created_by: createdBy,
    });
    return trx(ORDERS_TABLE).where({ id: orderId }).first();
  });
}

/**
 * Cancel an order: set status to 'cancelled' and append status history.
 */
export async function cancelOrder(orderId, note = null, createdBy = null) {
  return advanceStatus(orderId, 'cancelled', note, createdBy);
}

/**
 * Get the full order timeline: ordered status history entries for an order.
 */
export async function getOrderTimeline(orderId) {
  return db(STATUS_HISTORY_TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'asc')
    .select('*');
}

/**
 * Summarize revenue grouped by date (for admin reports).
 */
export async function getRevenueSummary({ from, to } = {}) {
  let query = db(ORDERS_TABLE)
    .select(
      db.raw('DATE(created_at) as date'),
      db.raw('COUNT(id) as order_count'),
      db.raw('SUM(total_amount) as total_revenue')
    )
    .whereNotIn('status', ['cancelled'])
    .groupByRaw('DATE(created_at)')
    .orderByRaw('DATE(created_at) ASC');
  if (from) query = query.where('created_at', '>=', from);
  if (to) query = query.where('created_at', '<=', to);
  return query;
}

/**
 * Find orders with a specific status within a date range.
 */
export async function findByStatusAndDateRange(status, from, to, { limit = 20, offset = 0 } = {}) {
  let query = db(ORDERS_TABLE).where({ status }).orderBy('created_at', 'desc').limit(limit).offset(offset).select('*');
  if (from) query = query.where('created_at', '>=', from);
  if (to) query = query.where('created_at', '<=', to);
  return query;
}

/**
 * Lock an order row for update within a transaction.
 */
export async function lockForUpdate(id, trx) {
  return trx(ORDERS_TABLE).where({ id }).forUpdate().first();
}
