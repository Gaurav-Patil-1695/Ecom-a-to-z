import db from '../client.js';

const TABLE = 'users';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByEmail(email) {
  return db(TABLE).where({ email }).first();
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
  return db(TABLE).limit(limit).offset(offset);
}

export async function count() {
  const [{ total }] = await db(TABLE).count('id as total');
  return Number(total);
}

export async function findWithRoles(id) {
  return db(TABLE)
    .select(
      'users.*',
      db.raw('JSON_ARRAYAGG(roles.name) as roles')
    )
    .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
    .leftJoin('roles', 'user_roles.role_id', 'roles.id')
    .where('users.id', id)
    .groupBy('users.id')
    .first();
}

export async function findByEmailWithRoles(email) {
  return db(TABLE)
    .select(
      'users.*',
      db.raw('JSON_ARRAYAGG(roles.name) as roles')
    )
    .leftJoin('user_roles', 'users.id', 'user_roles.user_id')
    .leftJoin('roles', 'user_roles.role_id', 'roles.id')
    .where('users.email', email)
    .groupBy('users.id')
    .first();
}

export async function updatePassword(id, passwordHash) {
  return db(TABLE).where({ id }).update({ password_hash: passwordHash });
}

export async function setPasswordResetToken(id, token, expiresAt) {
  return db(TABLE).where({ id }).update({
    password_reset_token: token,
    password_reset_expires_at: expiresAt,
  });
}

export async function findByPasswordResetToken(token) {
  return db(TABLE).where({ password_reset_token: token }).first();
}

export async function clearPasswordResetToken(id) {
  return db(TABLE).where({ id }).update({
    password_reset_token: null,
    password_reset_expires_at: null,
  });
}
