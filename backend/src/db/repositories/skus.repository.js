import db from '../client.js';

const TABLE = 'skus';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByProductId(productId) {
  return db(TABLE).where({ product_id: productId }).select('*');
}

export async function findByIdAndProductId(id, productId) {
  return db(TABLE).where({ id, product_id: productId }).first();
}

export async function findBySku(sku) {
  return db(TABLE).where({ sku }).first();
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

export async function countByProductId(productId) {
  const [{ total }] = await db(TABLE)
    .where({ product_id: productId })
    .count('id as total');
  return Number(total);
}

export async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

export async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

export async function updateByIdAndProductId(id, productId, data) {
  await db(TABLE).where({ id, product_id: productId }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findActive({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).where({ is_active: true }).limit(limit).offset(offset).select('*');
}

export async function findActiveByProductId(productId) {
  return db(TABLE).where({ product_id: productId, is_active: true }).select('*');
}

export async function setActive(id, isActive) {
  await db(TABLE).where({ id }).update({ is_active: isActive });
  return findById(id);
}

/**
 * Atomically decrement stock_quantity for a SKU by the given amount.
 * Only decrements if sufficient stock is available (stock_quantity >= amount).
 * Returns the number of affected rows (1 on success, 0 if insufficient stock).
 */
export async function decrementStock(id, amount, trx = db) {
  const affected = await trx(TABLE)
    .where('id', id)
    .where('stock_quantity', '>=', amount)
    .decrement('stock_quantity', amount);
  return affected;
}

/**
 * Atomically increment stock_quantity for a SKU by the given amount.
 * Returns the number of affected rows.
 */
export async function incrementStock(id, amount, trx = db) {
  const affected = await trx(TABLE)
    .where('id', id)
    .increment('stock_quantity', amount);
  return affected;
}

/**
 * Atomically decrement stock for multiple SKUs within a single transaction.
 * Each entry in items should have { skuId, quantity }.
 * Rolls back if any SKU has insufficient stock.
 * Returns an array of affected row counts, one per item.
 */
export async function decrementStockBulk(items) {
  return db.transaction(async (trx) => {
    const results = [];
    for (const { skuId, quantity } of items) {
      const affected = await trx(TABLE)
        .where('id', skuId)
        .where('stock_quantity', '>=', quantity)
        .decrement('stock_quantity', quantity);
      if (affected === 0) {
        throw new Error(`Insufficient stock for SKU ${skuId}`);
      }
      results.push(affected);
    }
    return results;
  });
}

/**
 * Atomically increment stock for multiple SKUs within a single transaction.
 * Each entry in items should have { skuId, quantity }.
 * Returns an array of affected row counts, one per item.
 */
export async function incrementStockBulk(items) {
  return db.transaction(async (trx) => {
    const results = [];
    for (const { skuId, quantity } of items) {
      const affected = await trx(TABLE)
        .where('id', skuId)
        .increment('stock_quantity', quantity);
      results.push(affected);
    }
    return results;
  });
}

/**
 * Get the current stock_quantity for a SKU (with optional row-level lock for use inside a transaction).
 */
export async function getStockQuantity(id, trx = db) {
  const row = await trx(TABLE).where({ id }).select('stock_quantity').first();
  return row ? Number(row.stock_quantity) : null;
}

/**
 * Lock a SKU row for update within a transaction and return the full row.
 * Use this before performing atomic stock operations.
 */
export async function lockForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}

/**
 * Find all SKUs with stock_quantity below (or equal to) a threshold.
 */
export async function findLowStock(threshold = 0, { limit = 100, offset = 0 } = {}) {
  return db(TABLE)
    .where('stock_quantity', '<=', threshold)
    .limit(limit)
    .offset(offset)
    .select('*');
}

/**
 * Find all out-of-stock SKUs (stock_quantity = 0).
 */
export async function findOutOfStock({ limit = 100, offset = 0 } = {}) {
  return db(TABLE)
    .where({ stock_quantity: 0 })
    .limit(limit)
    .offset(offset)
    .select('*');
}

/**
 * Set stock_quantity directly (for admin corrections).
 */
export async function setStockQuantity(id, quantity) {
  await db(TABLE).where({ id }).update({ stock_quantity: quantity });
  return findById(id);
}

/**
 * Find SKUs with their associated product information.
 */
export async function findWithProduct(id) {
  return db(TABLE)
    .select(`${TABLE}.*`, 'products.name as product_name', 'products.slug as product_slug')
    .leftJoin('products', `${TABLE}.product_id`, 'products.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithProduct({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .select(`${TABLE}.*`, 'products.name as product_name', 'products.slug as product_slug')
    .leftJoin('products', `${TABLE}.product_id`, 'products.id')
    .limit(limit)
    .offset(offset);
}
