import db from '../client.js';

const TABLE = 'addresses';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByUserId(userId) {
  return db(TABLE).where({ user_id: userId }).select('*');
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

export async function updateByIdAndUserId(id, userId, data) {
  await db(TABLE).where({ id, user_id: userId }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function removeByIdAndUserId(id, userId) {
  return db(TABLE).where({ id, user_id: userId }).delete();
}

export async function findDefaultByUserId(userId) {
  return db(TABLE).where({ user_id: userId, is_default: true }).first();
}

export async function clearDefaultForUser(userId) {
  return db(TABLE).where({ user_id: userId, is_default: true }).update({ is_default: false });
}

export async function setDefault(id, userId) {
  return db.transaction(async (trx) => {
    await trx(TABLE).where({ user_id: userId }).update({ is_default: false });
    await trx(TABLE).where({ id, user_id: userId }).update({ is_default: true });
    return trx(TABLE).where({ id }).first();
  });
}

export async function count(userId) {
  const [{ total }] = await db(TABLE)
    .where({ user_id: userId })
    .count('id as total');
  return Number(total);
}
