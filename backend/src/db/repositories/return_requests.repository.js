import db from '../client.js';

const TABLE = 'return_requests';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByOrderId(orderId) {
  return db(TABLE).where({ order_id: orderId }).select('*');
}

export async function findByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByUserId(userId) {
  const [{ total }] = await db(TABLE)
    .where({ user_id: userId })
    .count('id as total');
  return Number(total);
}

export async function findByStatus(status, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countByStatus(status) {
  const [{ total }] = await db(TABLE)
    .where({ status })
    .count('id as total');
  return Number(total);
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

export async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

export async function findByIdAndOrderId(id, orderId) {
  return db(TABLE).where({ id, order_id: orderId }).first();
}

export async function findWithDetails(id) {
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
    .leftJoin('users', `${TABLE}.user_id`, 'users.id')
    .where(`${TABLE}.id`, id)
    .first();
}

export async function findAllWithDetails({ limit = 20, offset = 0 } = {}) {
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
    .leftJoin('users', `${TABLE}.user_id`, 'users.id')
    .orderBy(`${TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function findByOrderIdWithDetails(orderId) {
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
    .leftJoin('users', `${TABLE}.user_id`, 'users.id')
    .where(`${TABLE}.order_id`, orderId)
    .orderBy(`${TABLE}.created_at`, 'desc');
}

export async function findByUserIdWithDetails(userId, { limit = 20, offset = 0 } = {}) {
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
    .leftJoin('users', `${TABLE}.user_id`, 'users.id')
    .where(`${TABLE}.user_id`, userId)
    .orderBy(`${TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function findByStatusWithDetails(status, { limit = 20, offset = 0 } = {}) {
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
    .leftJoin('users', `${TABLE}.user_id`, 'users.id')
    .where(`${TABLE}.status`, status)
    .orderBy(`${TABLE}.created_at`, 'desc')
    .limit(limit)
    .offset(offset);
}

export async function findPendingReview({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status: 'pending' })
    .orderBy('created_at', 'asc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function countPendingReview() {
  const [{ total }] = await db(TABLE)
    .where({ status: 'pending' })
    .count('id as total');
  return Number(total);
}

export async function findApproved({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status: 'approved' })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findRejected({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ status: 'rejected' })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function review(id, status, reviewNote, reviewedBy, trx = db) {
  await trx(TABLE).where({ id }).update({
    status,
    review_note: reviewNote,
    reviewed_by: reviewedBy,
    reviewed_at: new Date(),
  });
  return trx(TABLE).where({ id }).first();
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function countByOrderId(orderId) {
  const [{ total }] = await db(TABLE)
    .where({ order_id: orderId })
    .count('id as total');
  return Number(total);
}

export async function findByOrderIdAndUserId(orderId, userId) {
  return db(TABLE).where({ order_id: orderId, user_id: userId }).select('*');
}

export async function lockForUpdate(id, trx) {
  return trx(TABLE).where({ id }).forUpdate().first();
}

export async function findByRefundId(refundId) {
  return db(TABLE).where({ refund_id: refundId }).first();
}

export async function setRefund(id, refundId, trx = db) {
  await trx(TABLE).where({ id }).update({ refund_id: refundId });
  return trx(TABLE).where({ id }).first();
}

export async function search(query, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where('reason', 'like', `%${query}%`)
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}
