import db from '../client.js';

const TABLE = 'brands';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findBySlug(slug) {
  return db(TABLE).where({ slug }).first();
}

export async function findByName(name) {
  return db(TABLE).where({ name }).first();
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
  return db(TABLE).where({ is_active: true }).limit(limit).offset(offset).select('*');
}

export async function countActive() {
  const [{ total }] = await db(TABLE).where({ is_active: true }).count('id as total');
  return Number(total);
}

export async function findByIds(ids) {
  return db(TABLE).whereIn('id', ids).select('*');
}

export async function search(query, { limit = 20, offset = 0 } = {}) {
  return db(TABLE)
    .where('name', 'like', `%${query}%`)
    .limit(limit)
    .offset(offset)
    .select('*');
}

export async function setActive(id, isActive) {
  await db(TABLE).where({ id }).update({ is_active: isActive });
  return findById(id);
}
