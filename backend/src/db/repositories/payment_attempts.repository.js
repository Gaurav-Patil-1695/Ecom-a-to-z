import db from '../client.js';

const TABLE = 'payment_attempts';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function findLatestByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId })
    .orderBy('created_at', 'desc')
    .first();
}

export async function findByGatewayPaymentId(gatewayPaymentId) {
  return db(TABLE).where({ gateway_payment_id: gatewayPaymentId }).first();
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

export async function findSuccessfulByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'success' })
    .orderBy('created_at', 'desc')
    .first();
}

export async function findPendingByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'pending' })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function findFailedByOrderId(orderId) {
  return db(TABLE)
    .where({ order_id: orderId, status: 'failed' })
    .orderBy('created_at', 'desc')
    .select('*');
}

export async function updateByGatewayPaymentId(gatewayPaymentId, data, trx = db) {
  await trx(TABLE).where({ gateway_payment_id: gatewayPaymentId }).update(data);
  return trx(TABLE).where({ gateway_payment_id: gatewayPaymentId }).first();
}

export async function findWithOrderDetails(id) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'orders.status as order_status',
      'orders.total_amount as order_total_amount',
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name'
    )
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithOrderDetails({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .select(
      `${TABLE}.*`,
      'orders.status as order_status',
      'orders.total_amount as order_total_amount',
      'users.email as user_email',
      'users.first_name as user_first_name',
      'users.last_name as user_last_name'
    )
    .leftJoin('orders', `${TABLE}.order_id`, 'orders.id')
    .leftJoin('users', 'orders.user_id', 'users.id')
    .orderBy(`${TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function lockForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}

export async function setGatewayPaymentId(id, gatewayPaymentId, trx = db) {
  await trx(TABLE).where({ id }).update({ gateway_payment_id: gatewayPaymentId });
  return trx(TABLE).where({ id }).first();
}

export async function setGatewayResponse(id, gatewayResponse, trx = db) {
  await trx(TABLE).where({ id }).update({ gateway_response: gatewayResponse });
  return trx(TABLE).where({ id }).first();
}

export async function markSuccess(id, gatewayPaymentId, gatewayResponse, trx = db) {
  await trx(TABLE).where({ id }).update({
    status: 'success',
    gateway_payment_id: gatewayPaymentId,
    gateway_response: gatewayResponse,
  });
  return trx(TABLE).where({ id }).first();
}

export async function markFailed(id, gatewayResponse, trx = db) {
  await trx(TABLE).where({ id }).update({
    status: 'failed',
    gateway_response: gatewayResponse,
  });
  return trx(TABLE).where({ id }).first();
}

export async function hasSuccessfulAttempt(orderId) {
  const row = await db(TABLE)
    .where({ order_id: orderId, status: 'success' })
    .first();
  return !!row;
}

export async function getRevenueByGateway({ from, to } = {}) {
  let query = db(TABLE)
    .select(
      'gateway',
      db.raw('COUNT(id) as attempt_count'),
      db.raw('SUM(amount) as total_amount')
    )
    .where({ status: 'success' })
    .groupBy('gateway')
    .orderBy('total_amount', 'desc');
  if (from) query = query.where('created_at', '>=', from);
  if (to) query = query.where('created_at', '<=', to);
  return query;
}

export async function findByDateRange(from, to, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where('created_at', '>=', from)
    .where('created_at', '<=', to)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}
