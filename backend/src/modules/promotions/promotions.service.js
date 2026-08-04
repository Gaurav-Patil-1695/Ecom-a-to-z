import db from '../../db/index.js';
import { AppError } from '../../utils/errors.js';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Fetch a promo-code row by its human-readable code string.
 * Returns null when not found.
 */
async function findPromoCodeByCode(code) {
  const { rows } = await db.query(
    `SELECT * FROM promo_codes WHERE code = $1 LIMIT 1`,
    [code.trim().toUpperCase()]
  );
  return rows[0] || null;
}

/**
 * Fetch a promo-code row by its primary-key id.
 * Returns null when not found.
 */
async function findPromoCodeById(id) {
  const { rows } = await db.query(
    `SELECT * FROM promo_codes WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

/**
 * Fetch the cart with its items and the aggregate subtotal.
 */
async function fetchCartWithTotals(cartId) {
  // Cart header
  const { rows: cartRows } = await db.query(
    `SELECT * FROM carts WHERE id = $1 LIMIT 1`,
    [cartId]
  );
  const cart = cartRows[0];
  if (!cart) {
    throw new AppError('Cart not found', 404);
  }

  // Items with their effective unit price
  const { rows: items } = await db.query(
    `SELECT ci.*, s.price, s.sale_price,
            COALESCE(s.sale_price, s.price) AS effective_price
     FROM   cart_items ci
     JOIN   skus s ON s.id = ci.sku_id
     WHERE  ci.cart_id = $1`,
    [cartId]
  );

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.effective_price) * item.quantity,
    0
  );

  return { cart, items, subtotal };
}

/**
 * Count how many times a promo code has been used across all orders.
 */
async function countTotalUsage(promoCodeId) {
  const { rows } = await db.query(
    `SELECT COUNT(*) AS cnt FROM order_promo_codes WHERE promo_code_id = $1`,
    [promoCodeId]
  );
  return parseInt(rows[0].cnt, 10);
}

/**
 * Count how many times a specific user has used a promo code.
 */
async function countUsageByUser(promoCodeId, userId) {
  const { rows } = await db.query(
    `SELECT COUNT(*) AS cnt
     FROM   order_promo_codes opc
     JOIN   orders o ON o.id = opc.order_id
     WHERE  opc.promo_code_id = $1
       AND  o.user_id         = $2`,
    [promoCodeId, userId]
  );
  return parseInt(rows[0].cnt, 10);
}

/**
 * Compute the discount amount for a given promo code and subtotal.
 * Returns a non-negative number rounded to 2 decimal places.
 */
function calculateDiscount(promoCode, subtotal) {
  let discount = 0;

  if (promoCode.discount_type === 'percentage') {
    discount = subtotal * (parseFloat(promoCode.discount_value) / 100);
    if (promoCode.max_discount_amount !== null) {
      discount = Math.min(discount, parseFloat(promoCode.max_discount_amount));
    }
  } else if (promoCode.discount_type === 'fixed') {
    discount = parseFloat(promoCode.discount_value);
  }

  // Discount must never exceed the subtotal
  discount = Math.min(discount, subtotal);
  return Math.max(0, parseFloat(discount.toFixed(2)));
}

/**
 * Validate all eligibility rules for a promo code.
 * Throws AppError with an appropriate message on any failure.
 */
async function assertEligible(promoCode, { subtotal, userId }) {
  const now = new Date();

  // Active flag
  if (!promoCode.is_active) {
    throw new AppError('Promo code is not active', 400);
  }

  // Date range
  if (promoCode.starts_at && new Date(promoCode.starts_at) > now) {
    throw new AppError('Promo code is not yet valid', 400);
  }
  if (promoCode.expires_at && new Date(promoCode.expires_at) < now) {
    throw new AppError('Promo code has expired', 400);
  }

  // Minimum order value
  if (
    promoCode.min_order_amount !== null &&
    subtotal < parseFloat(promoCode.min_order_amount)
  ) {
    throw new AppError(
      `Minimum order amount of ${promoCode.min_order_amount} required for this promo code`,
      400
    );
  }

  // Global usage limit
  if (promoCode.usage_limit !== null) {
    const totalUsed = await countTotalUsage(promoCode.id);
    if (totalUsed >= promoCode.usage_limit) {
      throw new AppError('Promo code usage limit has been reached', 400);
    }
  }

  // Per-user usage limit
  if (promoCode.per_user_limit !== null && userId) {
    const userUsed = await countUsageByUser(promoCode.id, userId);
    if (userUsed >= promoCode.per_user_limit) {
      throw new AppError('You have already used this promo code the maximum number of times', 400);
    }
  }
}

// ---------------------------------------------------------------------------
// Public service methods
// ---------------------------------------------------------------------------

/**
 * Validate a promo code against a cart and return the discount breakdown.
 * Does NOT mutate any order rows — usage is tracked at order-placement time.
 *
 * @param {{ cartId: string, code: string, userId: string }} params
 * @returns {Promise<{ promoCodeId: string, code: string, discountType: string,
 *                     discountValue: number, discountAmount: number,
 *                     subtotal: number, totalAfterDiscount: number }>}
 */
export async function applyPromoCode({ cartId, code, userId }) {
  const promoCode = await findPromoCodeByCode(code);
  if (!promoCode) {
    throw new AppError('Invalid promo code', 400);
  }

  const { subtotal } = await fetchCartWithTotals(cartId);

  await assertEligible(promoCode, { subtotal, userId });

  const discountAmount = calculateDiscount(promoCode, subtotal);
  const totalAfterDiscount = parseFloat((subtotal - discountAmount).toFixed(2));

  return {
    promoCodeId: promoCode.id,
    code: promoCode.code,
    discountType: promoCode.discount_type,
    discountValue: parseFloat(promoCode.discount_value),
    discountAmount,
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalAfterDiscount,
  };
}

/**
 * Record promo code usage against an order.
 * Called internally by the orders service at order-placement time.
 *
 * @param {{ orderId: string, promoCodeId: string, discountAmount: number, client?: object }} params
 */
export async function recordPromoUsage({ orderId, promoCodeId, discountAmount, client }) {
  const runner = client || db;
  await runner.query(
    `INSERT INTO order_promo_codes (order_id, promo_code_id, discount_amount)
     VALUES ($1, $2, $3)
     ON CONFLICT (order_id) DO NOTHING`,
    [orderId, promoCodeId, discountAmount]
  );
}

// ---------------------------------------------------------------------------
// Admin CRUD
// ---------------------------------------------------------------------------

/**
 * List promo codes with optional filtering and pagination.
 *
 * @param {{ page: number, limit: number, active?: boolean }} params
 */
export async function listPromoCodes({ page = 1, limit = 20, active }) {
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (active !== undefined) {
    conditions.push(`is_active = $${values.length + 1}`);
    values.push(active);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await db.query(
    `SELECT COUNT(*) AS total FROM promo_codes ${where}`,
    values
  );
  const total = parseInt(countResult.rows[0].total, 10);

  values.push(limit);
  values.push(offset);

  const { rows } = await db.query(
    `SELECT * FROM promo_codes
     ${where}
     ORDER BY created_at DESC
     LIMIT $${values.length - 1} OFFSET $${values.length}`,
    values
  );

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Create a new promo code.
 *
 * @param {object} data
 */
export async function createPromoCode(data) {
  const {
    code,
    discount_type,
    discount_value,
    max_discount_amount = null,
    min_order_amount = null,
    usage_limit = null,
    per_user_limit = null,
    starts_at = null,
    expires_at = null,
    is_active = true,
    description = null,
  } = data;

  const normalizedCode = code.trim().toUpperCase();

  // Uniqueness check
  const existing = await findPromoCodeByCode(normalizedCode);
  if (existing) {
    throw new AppError('A promo code with this code already exists', 409);
  }

  const { rows } = await db.query(
    `INSERT INTO promo_codes
       (code, description, discount_type, discount_value,
        max_discount_amount, min_order_amount, usage_limit,
        per_user_limit, starts_at, expires_at, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      normalizedCode,
      description,
      discount_type,
      discount_value,
      max_discount_amount,
      min_order_amount,
      usage_limit,
      per_user_limit,
      starts_at,
      expires_at,
      is_active,
    ]
  );

  return rows[0];
}

/**
 * Fetch a single promo code by primary-key id.
 *
 * @param {string} promoCodeId
 */
export async function getPromoCodeById(promoCodeId) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found', 404);
  }
  return promoCode;
}

/**
 * Update an existing promo code.
 *
 * @param {string} promoCodeId
 * @param {object} data
 */
export async function updatePromoCode(promoCodeId, data) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found', 404);
  }

  const fields = [];
  const values = [];

  const allowedFields = [
    'code',
    'description',
    'discount_type',
    'discount_value',
    'max_discount_amount',
    'min_order_amount',
    'usage_limit',
    'per_user_limit',
    'starts_at',
    'expires_at',
    'is_active',
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      values.push(field === 'code' ? data[field].trim().toUpperCase() : data[field]);
      fields.push(`${field} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    return promoCode;
  }

  // If code is being updated, ensure uniqueness
  if (data.code !== undefined) {
    const normalizedCode = data.code.trim().toUpperCase();
    const existing = await findPromoCodeByCode(normalizedCode);
    if (existing && existing.id !== promoCodeId) {
      throw new AppError('A promo code with this code already exists', 409);
    }
  }

  values.push(promoCodeId);
  fields.push(`updated_at = NOW()`);

  const { rows } = await db.query(
    `UPDATE promo_codes
     SET    ${fields.join(', ')}
     WHERE  id = $${values.length}
     RETURNING *`,
    values
  );

  return rows[0];
}

/**
 * Delete a promo code by id.
 *
 * @param {string} promoCodeId
 */
export async function deletePromoCode(promoCodeId) {
  const promoCode = await findPromoCodeById(promoCodeId);
  if (!promoCode) {
    throw new AppError('Promo code not found', 404);
  }

  await db.query(`DELETE FROM promo_codes WHERE id = $1`, [promoCodeId]);
}
