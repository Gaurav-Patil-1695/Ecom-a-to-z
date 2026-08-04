import pool from '../../db/pool.js';
import { AppError } from '../../utils/AppError.js';

/**
 * List all addresses belonging to a user.
 */
export async function listAddressesService(userId) {
  const { rows } = await pool.query(
    `SELECT
       id,
       user_id,
       full_name,
       phone,
       line1,
       line2,
       city,
       state,
       pin_code,
       is_default,
       created_at,
       updated_at
     FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Get a single address by id, scoped to the user.
 */
export async function getAddressService(userId, addressId) {
  const { rows } = await pool.query(
    `SELECT
       id,
       user_id,
       full_name,
       phone,
       line1,
       line2,
       city,
       state,
       pin_code,
       is_default,
       created_at,
       updated_at
     FROM addresses
     WHERE id = $1 AND user_id = $2`,
    [addressId, userId]
  );

  if (!rows.length) {
    throw new AppError('Address not found.', 404);
  }

  return rows[0];
}

/**
 * Check whether a given pin code is serviceable.
 * Returns true / false.
 */
async function isPinCodeServiceable(pinCode) {
  const { rows } = await pool.query(
    `SELECT 1 FROM serviceable_pin_codes WHERE pin_code = $1 LIMIT 1`,
    [pinCode]
  );
  return rows.length > 0;
}

/**
 * Unset the default flag for all addresses of a user within a transaction.
 */
async function clearDefaultAddress(client, userId) {
  await client.query(
    `UPDATE addresses SET is_default = FALSE WHERE user_id = $1`,
    [userId]
  );
}

/**
 * Create a new address for the user.
 * If is_default is true, all other addresses are un-defaulted.
 * Validates serviceability of the pin_code.
 */
export async function createAddressService(userId, data) {
  const {
    full_name,
    phone,
    line1,
    line2 = null,
    city,
    state,
    pin_code,
    is_default = false,
  } = data;

  const serviceable = await isPinCodeServiceable(pin_code);
  if (!serviceable) {
    throw new AppError('Delivery is not available at this pin code.', 422);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Count existing addresses to determine auto-default for first address
    const { rows: countRows } = await client.query(
      `SELECT COUNT(*) AS cnt FROM addresses WHERE user_id = $1`,
      [userId]
    );
    const isFirst = parseInt(countRows[0].cnt, 10) === 0;
    const makeDefault = is_default || isFirst;

    if (makeDefault) {
      await clearDefaultAddress(client, userId);
    }

    const { rows } = await client.query(
      `INSERT INTO addresses
         (user_id, full_name, phone, line1, line2, city, state, pin_code, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING
         id,
         user_id,
         full_name,
         phone,
         line1,
         line2,
         city,
         state,
         pin_code,
         is_default,
         created_at,
         updated_at`,
      [userId, full_name, phone, line1, line2, city, state, pin_code, makeDefault]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Update an existing address.
 * If is_default is set to true, all other addresses are un-defaulted.
 * Validates serviceability when pin_code is changed.
 */
export async function updateAddressService(userId, addressId, data) {
  // Verify ownership
  const existing = await getAddressService(userId, addressId);

  const {
    full_name = existing.full_name,
    phone = existing.phone,
    line1 = existing.line1,
    line2 = existing.line2,
    city = existing.city,
    state = existing.state,
    pin_code = existing.pin_code,
    is_default = existing.is_default,
  } = data;

  // Validate serviceability only when pin_code actually changes
  if (pin_code !== existing.pin_code) {
    const serviceable = await isPinCodeServiceable(pin_code);
    if (!serviceable) {
      throw new AppError('Delivery is not available at this pin code.', 422);
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    if (is_default) {
      await clearDefaultAddress(client, userId);
    }

    const { rows } = await client.query(
      `UPDATE addresses
       SET
         full_name  = $1,
         phone      = $2,
         line1      = $3,
         line2      = $4,
         city       = $5,
         state      = $6,
         pin_code   = $7,
         is_default = $8,
         updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING
         id,
         user_id,
         full_name,
         phone,
         line1,
         line2,
         city,
         state,
         pin_code,
         is_default,
         created_at,
         updated_at`,
      [full_name, phone, line1, line2, city, state, pin_code, is_default, addressId, userId]
    );

    await client.query('COMMIT');
    return rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Delete an address belonging to the user.
 * If the deleted address was the default, promote the most recently created
 * remaining address to default (if any).
 */
export async function deleteAddressService(userId, addressId) {
  // Verify ownership
  const existing = await getAddressService(userId, addressId);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(
      `DELETE FROM addresses WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    // If deleted address was the default, promote the next most recent one
    if (existing.is_default) {
      await client.query(
        `UPDATE addresses
         SET is_default = TRUE, updated_at = NOW()
         WHERE id = (
           SELECT id FROM addresses
           WHERE user_id = $1
           ORDER BY created_at DESC
           LIMIT 1
         )`,
        [userId]
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
