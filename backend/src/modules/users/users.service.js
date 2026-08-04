import bcrypt from 'bcryptjs';
import { pool } from '../../db/pool.js';
import { AppError } from '../../middleware/error.middleware.js';

/**
 * Sanitizes a user row from the database, removing sensitive fields.
 */
function sanitizeUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

/**
 * GET /users/me
 * Returns the currently authenticated user's profile.
 */
export async function getMe(userId) {
  const { rows } = await pool.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }

  return rows[0];
}

/**
 * PATCH /users/me
 * Updates the currently authenticated user's profile.
 */
export async function updateMe(userId, body) {
  const { first_name, last_name, phone } = body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (first_name !== undefined) {
    fields.push(`first_name = $${idx++}`);
    values.push(first_name);
  }
  if (last_name !== undefined) {
    fields.push(`last_name = $${idx++}`);
    values.push(last_name);
  }
  if (phone !== undefined) {
    fields.push(`phone = $${idx++}`);
    values.push(phone);
  }

  if (fields.length === 0) {
    return getMe(userId);
  }

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  const { rows } = await pool.query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = $${idx}
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    values
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }

  return rows[0];
}

/**
 * POST /users/me/change-password
 * Changes the currently authenticated user's password.
 */
export async function changePassword(userId, body) {
  const { current_password, new_password } = body;

  const { rows } = await pool.query(
    `SELECT id, password_hash FROM users WHERE id = $1`,
    [userId]
  );

  const user = rows[0];
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isMatch = await bcrypt.compare(current_password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Current password is incorrect.', 400);
  }

  const newHash = await bcrypt.hash(new_password, 12);

  await pool.query(
    `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
    [newHash, userId]
  );
}

/**
 * GET /users
 * Admin: Returns a paginated list of all users.
 */
export async function getUsers(query) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const offset = (page - 1) * limit;

  const filters = [];
  const values = [];
  let idx = 1;

  if (query.role) {
    filters.push(`role = $${idx++}`);
    values.push(query.role);
  }

  if (query.is_active !== undefined) {
    filters.push(`is_active = $${idx++}`);
    values.push(query.is_active === 'true' || query.is_active === true);
  }

  if (query.search) {
    filters.push(
      `(email ILIKE $${idx} OR first_name ILIKE $${idx} OR last_name ILIKE $${idx})`
    );
    values.push(`%${query.search}%`);
    idx++;
  }

  const whereClause = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM users ${whereClause}`,
    values
  );
  const total = parseInt(countResult.rows[0].count, 10);

  values.push(limit);
  values.push(offset);

  const { rows } = await pool.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    values
  );

  return {
    users: rows,
    pagination: {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /users/:userId
 * Admin: Returns a single user by ID.
 */
export async function getUserById(userId) {
  const { rows } = await pool.query(
    `SELECT id, email, first_name, last_name, phone, role, is_active, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }

  return rows[0];
}

/**
 * PATCH /users/:userId
 * Admin: Updates a user by ID (including role assignment and account status).
 */
export async function updateUser(userId, body) {
  const { first_name, last_name, phone, role, is_active } = body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (first_name !== undefined) {
    fields.push(`first_name = $${idx++}`);
    values.push(first_name);
  }
  if (last_name !== undefined) {
    fields.push(`last_name = $${idx++}`);
    values.push(last_name);
  }
  if (phone !== undefined) {
    fields.push(`phone = $${idx++}`);
    values.push(phone);
  }
  if (role !== undefined) {
    fields.push(`role = $${idx++}`);
    values.push(role);
  }
  if (is_active !== undefined) {
    fields.push(`is_active = $${idx++}`);
    values.push(is_active);
  }

  if (fields.length === 0) {
    return getUserById(userId);
  }

  fields.push(`updated_at = NOW()`);
  values.push(userId);

  const { rows } = await pool.query(
    `UPDATE users
     SET ${fields.join(', ')}
     WHERE id = $${idx}
     RETURNING id, email, first_name, last_name, phone, role, is_active, created_at, updated_at`,
    values
  );

  if (!rows[0]) {
    throw new AppError('User not found.', 404);
  }

  return rows[0];
}

/**
 * DELETE /users/:userId
 * Admin: Deletes a user by ID.
 */
export async function deleteUser(userId) {
  const { rowCount } = await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [userId]
  );

  if (rowCount === 0) {
    throw new AppError('User not found.', 404);
  }
}
