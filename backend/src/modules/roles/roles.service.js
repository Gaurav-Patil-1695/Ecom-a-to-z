import pool from '../../../db/pool.js';

/**
 * List all roles.
 */
export async function listRoles() {
  const { rows } = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM roles ORDER BY name ASC'
  );
  return rows;
}

/**
 * Create a new role.
 * @param {object} data - { name, description }
 */
export async function createRole(data) {
  const { name, description = null } = data;
  const { rows } = await pool.query(
    `INSERT INTO roles (name, description)
     VALUES ($1, $2)
     RETURNING id, name, description, created_at, updated_at`,
    [name, description]
  );
  return rows[0];
}

/**
 * Get a single role by id.
 * @param {string|number} roleId
 */
export async function getRole(roleId) {
  const { rows } = await pool.query(
    'SELECT id, name, description, created_at, updated_at FROM roles WHERE id = $1',
    [roleId]
  );
  return rows[0] || null;
}

/**
 * Update a role.
 * @param {string|number} roleId
 * @param {object} data - { name, description }
 */
export async function updateRole(roleId, data) {
  const existing = await getRole(roleId);
  if (!existing) return null;

  const name = data.name !== undefined ? data.name : existing.name;
  const description = data.description !== undefined ? data.description : existing.description;

  const { rows } = await pool.query(
    `UPDATE roles
     SET name = $1, description = $2, updated_at = NOW()
     WHERE id = $3
     RETURNING id, name, description, created_at, updated_at`,
    [name, description, roleId]
  );
  return rows[0] || null;
}

/**
 * Delete a role by id.
 * Also removes all user-role and role-permission associations.
 * @param {string|number} roleId
 */
export async function deleteRole(roleId) {
  const existing = await getRole(roleId);
  if (!existing) return null;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM user_roles WHERE role_id = $1', [roleId]);
    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
    await client.query('DELETE FROM roles WHERE id = $1', [roleId]);
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Get permissions associated with a role.
 * @param {string|number} roleId
 */
export async function getRolePermissions(roleId) {
  const role = await getRole(roleId);
  if (!role) return null;

  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.description
     FROM permissions p
     INNER JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1
     ORDER BY p.name ASC`,
    [roleId]
  );
  return { role, permissions: rows };
}

/**
 * Replace the full set of permissions for a role.
 * @param {string|number} roleId
 * @param {object} data - { permissions: string[] | number[] }
 */
export async function updateRolePermissions(roleId, data) {
  const role = await getRole(roleId);
  if (!role) return null;

  const permissionIds = Array.isArray(data.permissions) ? data.permissions : [];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
    if (permissionIds.length > 0) {
      const values = permissionIds
        .map((_, idx) => `($1, $${idx + 2})`)
        .join(', ');
      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id) VALUES ${values}`,
        [roleId, ...permissionIds]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return getRolePermissions(roleId);
}

/**
 * Assign a role to a user.
 * @param {string|number} userId
 * @param {string|number} roleId
 */
export async function assignRoleToUser(userId, roleId) {
  const { rows } = await pool.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, role_id) DO NOTHING
     RETURNING user_id, role_id`,
    [userId, roleId]
  );
  return rows[0] || { user_id: userId, role_id: roleId };
}

/**
 * Remove a role from a user.
 * @param {string|number} userId
 * @param {string|number} roleId
 */
export async function removeRoleFromUser(userId, roleId) {
  const { rowCount } = await pool.query(
    'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2',
    [userId, roleId]
  );
  return rowCount > 0;
}

/**
 * Get all roles assigned to a user.
 * @param {string|number} userId
 */
export async function getUserRoles(userId) {
  const { rows } = await pool.query(
    `SELECT r.id, r.name, r.description
     FROM roles r
     INNER JOIN user_roles ur ON ur.role_id = r.id
     WHERE ur.user_id = $1
     ORDER BY r.name ASC`,
    [userId]
  );
  return rows;
}

/**
 * Replace all roles for a user.
 * @param {string|number} userId
 * @param {Array<string|number>} roleIds
 */
export async function setUserRoles(userId, roleIds) {
  const ids = Array.isArray(roleIds) ? roleIds : [];
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM user_roles WHERE user_id = $1', [userId]);
    if (ids.length > 0) {
      const values = ids.map((_, idx) => `($1, $${idx + 2})`).join(', ');
      await client.query(
        `INSERT INTO user_roles (user_id, role_id) VALUES ${values}`,
        [userId, ...ids]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  return getUserRoles(userId);
}
