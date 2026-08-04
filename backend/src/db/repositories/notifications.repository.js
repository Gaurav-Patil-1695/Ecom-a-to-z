import db from '../client.js';

const TABLE = 'notifications';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
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

export async function countUnreadByUserId(userId) {
  const [{ total }] = await db(TABLE)
    .where({ user_id: userId, is_read: false })
    .count('id as total');
  return Number(total);
}

export async function findUnreadByUserId(userId, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id: userId, is_read: false })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).first();
}

export async function create(data) {
  const [id] = await db(TABLE).insert(data);
  return findById(id);
}

export async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
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

export async function markAsRead(id) {
  await db(TABLE).where({ id }).update({ is_read: true });
  return findById(id);
}

export async function markAsReadByIdAndUserId(id, userId) {
  await db(TABLE).where({ id, user_id: userId }).update({ is_read: true });
  return findById(id);
}

export async function markAllAsReadByUserId(userId) {
  return db(TABLE)
    .where({ user_id: userId, is_read: false })
    .update({ is_read: true });
}

export async function removeByUserId(userId) {
  return db(TABLE).where({ user_id: userId }).delete();
}

export async function findByType(type, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ type })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findByUserIdAndType(userId, type, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ user_id: userId, type })
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function createBulk(notifications) {
  if (!notifications || notifications.length === 0) return [];
  await db(TABLE).insert(notifications);
  return db(TABLE)
    .whereIn(
      'id',
      db(TABLE)
        .select('id')
        .orderBy('id', 'desc')
        .limit(notifications.length)
    )
    .select('*');
}

export async function removeOlderThan(date) {
  return db(TABLE).where('created_at', '<', date).delete();
}

export async function removeReadOlderThan(date) {
  return db(TABLE)
    .where({ is_read: true })
    .where('created_at', '<', date)
    .delete();
}
