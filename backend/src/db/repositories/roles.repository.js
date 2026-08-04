import db from '../client.js';

const TABLE = 'roles';
const USER_ROLES_TABLE = 'user_roles';

export async function findById(id) {
  return db(TABLE).where({ id }).first();
}

export async function findByName(name) {
  return db(TABLE).where({ name }).first();
}

export async function findAll() {
  return db(TABLE).select('*');
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

export async function assignRoleToUser(userId, roleId) {
  return db(USER_ROLES_TABLE)
    .insert({ user_id: userId, role_id: roleId })
    .onConflict(['user_id', 'role_id'])
    .ignore();
}

export async function removeRoleFromUser(userId, roleId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId, role_id: roleId }).delete();
}

export async function findRolesByUserId(userId) {
  return db(TABLE)
    .select('roles.*')
    .join(USER_ROLES_TABLE, 'roles.id', 'user_roles.role_id')
    .where('user_roles.user_id', userId);
}

export async function findUsersByRoleId(roleId) {
  return db('users')
    .select('users.*')
    .join(USER_ROLES_TABLE, 'users.id', 'user_roles.user_id')
    .where('user_roles.role_id', roleId);
}

export async function removeAllRolesFromUser(userId) {
  return db(USER_ROLES_TABLE).where({ user_id: userId }).delete();
}

export async function setUserRoles(userId, roleIds) {
  return db.transaction(async (trx) => {
    await trx(USER_ROLES_TABLE).where({ user_id: userId }).delete();
    if (roleIds && roleIds.length > 0) {
      const rows = roleIds.map((roleId) => ({ user_id: userId, role_id: roleId }));
      await trx(USER_ROLES_TABLE).insert(rows);
    }
  });
}

export async function userHasRole(userId, roleName) {
  const row = await db(USER_ROLES_TABLE)
    .join(TABLE, 'roles.id', 'user_roles.role_id')
    .where('user_roles.user_id', userId)
    .where('roles.name', roleName)
    .first();
  return !!row;
}
