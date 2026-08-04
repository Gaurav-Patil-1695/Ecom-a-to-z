import db from '../client.js';

const TABLE = 'serviceable_pin_codes';

export async function findByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode }).first();
}

export async function isServiceable(pinCode) {
  const row = await db(TABLE).where({ pin_code: pinCode, is_active: true }).first();
  return !!row;
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

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function update(id, data) {
  await db(TABLE).where({ id }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(TABLE).where({ id }).delete();
}

export async function findActiveByPinCode(pinCode) {
  return db(TABLE).where({ pin_code: pinCode, is_active: true }).first();
}

export async function findAllActive({ limit = 20, offset = 0 } = {}) {
  return db(TABLE).where({ is_active: true }).limit(limit).offset(offset).select('*');
}

export async function upsertByPinCode(pinCode, data) {
  const existing = await findByPinCode(pinCode);
  if (existing) {
    await db(TABLE).where({ pin_code: pinCode }).update(data);
    return findByPinCode(pinCode);
  }
  const [id] = await db(TABLE).insert({ pin_code: pinCode, ...data });
  return findById(id);
}

export async function findByPinCodes(pinCodes) {
  return db(TABLE).whereIn('pin_code', pinCodes).select('*');
}

export async function findActiveByPinCodes(pinCodes) {
  return db(TABLE).whereIn('pin_code', pinCodes).where({ is_active: true }).select('*');
}
