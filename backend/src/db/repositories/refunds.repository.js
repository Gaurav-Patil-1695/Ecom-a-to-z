import db from '../client.js';

const TABLE = 'refunds';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).select('*');
}

export async function findByPaymentAttemptId(paymentAttemptId) {
  return db(TABLE).where({ payment_attempt_id: paymentAttemptId }).select('*');
}

export async function findByStatus(status, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
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

export async function countByStatus(status) {
  const [{ total }] = await db(TABLE)
    .where({ status })
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

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findWithDetails(id) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'orders.status as order_status',
      'orders.user_id as order_user_id',
      'payment_attempts.gateway as payment_gateway',
      'payment_attempts.gateway_transaction_id'
    )
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .leftJoin('payment_attempts', `${TABLE}.payment_attempt_id`, 'payment_attempts.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithDetails({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'orders.status as order_status',
      'orders.user_id as order_user_id',
      'payment_attempts.gateway as payment_gateway',
      'payment_attempts.gateway_transaction_id'
    )
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .leftJoin('payment_attempts', `${TABLE}.payment_attempt_id`, 'payment_attempts.id')
    .orderBy(`${TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function findByOrderIdWithDetails(orderId) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'orders.status as order_status',
      'orders.user_id as order_user_id',
      'payment_attempts.gateway as payment_gateway',
      'payment_attempts.gateway_transaction_id'
    )
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .leftJoin('payment_attempts', `${TABLE}.payment_attempt_id`, 'payment_attempts.id')
    .where(`${TABLE}.order_id`, orderId)
    .orderBy(`${TABLE}.created_at`, 'desc')
    .select('*');
}

export async function getTotalRefundedAmountByOrderId(orderId) {
  const [{ total }] = await db(TABLE)
    .where({ order_id: orderId })
    .whereIn('status', ['pending', 'processed'])
    .sum('amount as total');
  return Number(total) || 0;
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function findByReturnRequestId(returnRequestId) {
  return db(TABLE).where({ return_request_id: returnRequestId }).select('*');
}

export async function findPendingByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'pending' })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function findProcessedByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'processed' })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function lockForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}
