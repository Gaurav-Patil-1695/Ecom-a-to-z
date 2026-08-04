import db from '../client.js';

const TABLE = 'stock_reservations';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).select('*');
}

export async function findBySkuId(skuId) {
  return db(TABLE).where({ sku_id: skuId }).select('*');
}

export async function findByOrderIdAndSkuId(orderId, skuId) {
  return db(TABLE).where({ order_id: orderId, sku_id: skuId }).first();
}

export async function findByStatus(status, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

export async function countByOrderId(orderId) {
  const [{ total }] = await db(TABLE)
    .where({ order_id: orderId })
    .count('id as total');
  return Number(total);
}

export async function countBySkuId(skuId) {
  const [{ total }] = await db(TABLE)
    .where({ sku_id: skuId })
    .count('id as total');
  return Number(total);
}

export async function create(data, trx = db) {
  const [id] = await trx(TABLE).insert(data);
  return trx(TABLE).where({ id }).first();
}

export async function update(id, data, trx = db) {
  await trx(TABLE).where({ id }).update(data);
  return trx(TABLE).where({ id }).first();
}

export async function updateStatus(id, status, trx = db) {
  await trx(TABLE).where({ id }).update({ status });
  return trx(TABLE).where({ id }).first();
}

export async function remove(id, trx = db) {
  return trx(TABLE).where({ id }).delete();
}

export async function removeByOrderId(orderId, trx = db) {
  return trx(TABLE).where({ order_id: orderId }).delete();
}

export async function removeBySkuId(skuId, trx = db) {
  return trx(TABLE).where({ sku_id: skuId }).delete();
}

export async function findActiveByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'reserved' })
    .select('*');
}

export async function findActiveBySkuId(skuId) {
  return db(TABLE)
    .where({ sku_id: skuId, status: 'reserved' })
    .select('*');
}

export async function getTotalReservedQuantityForSku(skuId) {
  const [{ total }] = await db(TABLE)
    .where({ sku_id: skuId, status: 'reserved' })
    .sum('quantity as total');
  return Number(total) || 0;
}

/**
 * Create reservations for multiple SKUs within a single transaction.
 * Each entry in items should have { skuId, orderId, quantity }.
 * Returns an array of created reservation records.
 */
export async function createBulk(items, trx = db) {
  const rows = items.map(({ skuId, orderId, quantity }) => ({
    sku_id: skuId,
    order_id: orderId,
    quantity,
    status: 'reserved',
  }));
  await trx(TABLE).insert(rows);
  return trx(TABLE)
    .where({ order_id: items[0]?.orderId })
    .select('*');
}

/**
 * Release (delete) all reservations for a given order within a transaction.
 */
export async function releaseByOrderId(orderId, trx = db) {
  return trx(TABLE).where({ order_id: orderId, status: 'reserved' }).delete();
}

/**
 * Confirm all reservations for a given order (set status to 'confirmed').
 */
export async function confirmByOrderId(orderId, trx = db) {
  await trx(TABLE)
    .where({ order_id: orderId, status: 'reserved' })
    .update({ status: 'confirmed' });
  return trx(TABLE).where({ order_id: orderId }).select('*');
}

/**
 * Mark all reservations for a given order as released (set status to 'released').
 */
export async function markReleasedByOrderId(orderId, trx = db) {
  await trx(TABLE)
    .where({ order_id: orderId })
    .update({ status: 'released' });
  return trx(TABLE).where({ order_id: orderId }).select('*');
}

/**
 * Lock a stock reservation row for update within a transaction.
 */
export async function lockForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}

/**
 * Find reservations with their associated SKU and order information.
 */
export async function findWithDetails(id) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'skus.sku as sku_code',
      'skus.stock_quantity',
      'products.name as product_name',
      'products.slug as product_slug',
      'orders.status as order_status'
    )
    .leftJoin('skus', `${TABLE}.sku_id`, 'skus.id')
    .leftJoin('products', 'skus.product_id', 'products.id')
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithDetails({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'skus.sku as sku_code',
      'skus.stock_quantity',
      'products.name as product_name',
      'products.slug as product_slug',
      'orders.status as order_status'
    )
    .leftJoin('skus', `${TABLE}.sku_id`, 'skus.id')
    .leftJoin('products', 'skus.product_id', 'products.id')
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .limit(limit)
    .offset(offset);
}

/**
 * Find all expired reservations (where expires_at is in the past and status is still 'reserved').
 */
export async function findExpired(now = new Date()) {
  return db(TABLE)
    .where({ status: 'reserved' })
    .where('expires_at', '<', now)
    .select('*');
}

/**
 * Release all expired reservations atomically within a transaction.
 * Returns the number of rows updated.
 */
export async function releaseExpired(now = new Date(), trx = db) {
  return trx(TABLE)
    .where({ status: 'reserved' })
    .where('expires_at', '<', now)
    .update({ status: 'released' });
}
