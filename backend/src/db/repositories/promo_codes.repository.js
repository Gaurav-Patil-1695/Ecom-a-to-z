import db from '../client.js';

const TABLE = 'promo_codes';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByCode(code) {
  return db(TABLE).where({ code }).first();
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
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

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findActive({ limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where({ is_active: true })
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findActiveByCode(code) {
  return db(TABLE).where({ code, is_active: true }).first();
}

export async function findValid(code, now = new Date()) {
  return db(TABLE)
    .where({ code, is_active: true })
    .where(function () {
      this.whereNull('valid_from').orWhere('valid_from', '<=', now);
    })
    .where(function () {
      this.whereNull('valid_until').orWhere('valid_until', '>=', now);
    })
    .first();
}

export async function findExpired({ limit = 20, offset = 0 } = {}) {
  const now = new Date();
  return db(TABLE)
    .where('valid_until', '<', now)
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function findUpcoming({ limit = 20, offset = 0 } = {}) {
  const now = new Date();
  return db(TABLE)
    .where('valid_from', '>', now)
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function incrementUsageCount(id, trx = db) {
  await trx(TABLE).where({ id }).increment('usage_count', 1);
  return trx(TABLE).where({ id }).first();
}

export async function decrementUsageCount(id, trx = db) {
  await trx(TABLE)
    .where({ id })
    .where('usage_count', '>', 0)
    .decrement('usage_count', 1);
  return trx(TABLE).where({ id }).first();
}

export async function setActive(id, isActive) {
  await db(TABLE).where({ id }).update({ is_active: isActive });
  return findById(id);
}

export async function hasExceededUsageLimit(id) {
  const row = await findById(id);
  if (!row) return true;
  if (row.max_uses === null || row.max_uses === undefined) return false;
  return Number(row.usage_count) >= Number(row.max_uses);
}

export async function isValidForUser(code, userId, now = new Date()) {
  const promoCode = await findValid(code, now);
  if (!promoCode) return false;
  if (promoCode.max_uses !== null && promoCode.max_uses !== undefined) {
    if (Number(promoCode.usage_count) >= Number(promoCode.max_uses)) return false;
  }
  if (promoCode.max_uses_per_user !== null && promoCode.max_uses_per_user !== undefined) {
    const userUsageCount = await countUsageByUser(promoCode.id, userId);
    if (userUsageCount >= Number(promoCode.max_uses_per_user)) return false;
  }
  return promoCode;
}

export async function countUsageByUser(promoCodeId, userId) {
  const [{ total }] = await db('orders')
    .where({ promo_code_id: promoCodeId, user_id: userId })
    .count('id as total');
  return Number(total);
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function search(query, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where('code', 'like', `%${query}%`)
    .limit(limit)
    .offset(offset)
    .select('*');
}
