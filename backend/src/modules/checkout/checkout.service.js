import { db } from '../../db/index.js';
import { AppError } from '../../utils/AppError.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory checkout session store (replace with Redis or DB table in production)
const checkoutSessions = new Map();

/**
 * Retrieve a cart by its ID, verifying ownership by userId or guestId.
 */
const getCartForOwner = async ({ cartId, userId, guestId }) => {
  const result = await db.query(
    `SELECT c.id, c.user_id, c.guest_id, c.promo_code_id,
            c.discount_amount, c.subtotal, c.total
     FROM carts c
     WHERE c.id = $1`,
    [cartId]
  );

  if (result.rows.length === 0) {
    throw new AppError('Cart not found.', 404);
  }

  const cart = result.rows[0];

  const ownsCart =
    (userId && cart.user_id === userId) ||
    (guestId && cart.guest_id === guestId);

  if (!ownsCart) {
    throw new AppError('You do not have access to this cart.', 403);
  }

  return cart;
};

/**
 * Retrieve all items for a given cart including SKU and product details.
 */
const getCartItems = async (cartId) => {
  const result = await db.query(
    `SELECT ci.id, ci.cart_id, ci.sku_id, ci.quantity, ci.unit_price,
            s.stock_quantity, s.attributes,
            p.id AS product_id, p.name AS product_name, p.images
     FROM cart_items ci
     JOIN skus s ON s.id = ci.sku_id
     JOIN products p ON p.id = s.product_id
     WHERE ci.cart_id = $1`,
    [cartId]
  );
  return result.rows;
};

/**
 * POST /checkout/start
 * Validate cart, confirm stock, create a checkout session.
 */
const startCheckout = async ({ cartId, userId, guestId }) => {
  if (!cartId) {
    throw new AppError('cartId is required.', 400);
  }

  const cart = await getCartForOwner({ cartId, userId, guestId });
  const items = await getCartItems(cartId);

  if (items.length === 0) {
    throw new AppError('Cart is empty. Add items before checking out.', 400);
  }

  // Confirm stock availability for each item
  for (const item of items) {
    if (item.stock_quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for product "${item.product_name}". Only ${item.stock_quantity} unit(s) available.`,
        409
      );
    }
  }

  const sessionId = uuidv4();

  // Retrieve promo details if a promo is applied
  let promo = null;
  if (cart.promo_code_id) {
    const promoResult = await db.query(
      `SELECT id, code, discount_type, discount_value FROM promo_codes WHERE id = $1`,
      [cart.promo_code_id]
    );
    if (promoResult.rows.length > 0) {
      promo = promoResult.rows[0];
    }
  }

  const session = {
    id: sessionId,
    cartId,
    userId: userId ?? null,
    guestId: guestId ?? null,
    items,
    subtotal: cart.subtotal,
    discountAmount: cart.discount_amount ?? 0,
    total: cart.total,
    promo,
    address: null,
    status: 'started',
    createdAt: Date.now(),
  };

  checkoutSessions.set(sessionId, session);

  return {
    checkoutSessionId: sessionId,
    cartId,
    itemCount: items.length,
    subtotal: cart.subtotal,
    discountAmount: cart.discount_amount ?? 0,
    total: cart.total,
    promo: promo
      ? { code: promo.code, discountType: promo.discount_type, discountValue: promo.discount_value }
      : null,
  };
};

/**
 * Retrieve and validate a checkout session for the calling user/guest.
 */
const getSession = (checkoutSessionId, userId, guestId) => {
  if (!checkoutSessionId) {
    throw new AppError('checkoutSessionId is required.', 400);
  }

  const session = checkoutSessions.get(checkoutSessionId);
  if (!session) {
    throw new AppError('Checkout session not found or has expired.', 404);
  }

  const ownsSession =
    (userId && session.userId === userId) ||
    (guestId && session.guestId === guestId) ||
    (!session.userId && !session.guestId);

  if (!ownsSession) {
    throw new AppError('You do not have access to this checkout session.', 403);
  }

  return session;
};

/**
 * Validate an address object has all required fields.
 */
const validateAddressFields = (addr) => {
  const required = ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode', 'country'];
  for (const field of required) {
    if (!addr[field] || String(addr[field]).trim() === '') {
      throw new AppError(`Address field "${field}" is required.`, 400);
    }
  }
};

/**
 * POST /checkout/address
 * Attach a delivery address to the checkout session.
 * Accepts either an existing addressId (for authenticated users) or a raw address object.
 */
const saveAddress = async ({ checkoutSessionId, addressId, address, userId, guestId }) => {
  const session = getSession(checkoutSessionId, userId, guestId);

  let resolvedAddress;

  if (addressId) {
    // Look up stored address
    if (!userId) {
      throw new AppError('Authentication is required to use a saved address.', 401);
    }

    const result = await db.query(
      `SELECT id, full_name, phone, address_line1, address_line2, city, state, postal_code, country
       FROM addresses
       WHERE id = $1 AND user_id = $2`,
      [addressId, userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Address not found.', 404);
    }

    const row = result.rows[0];
    resolvedAddress = {
      id: row.id,
      fullName: row.full_name,
      phone: row.phone,
      addressLine1: row.address_line1,
      addressLine2: row.address_line2 ?? null,
      city: row.city,
      state: row.state,
      postalCode: row.postal_code,
      country: row.country,
    };
  } else if (address) {
    validateAddressFields(address);
    resolvedAddress = { ...address };
  } else {
    throw new AppError('Either addressId or address is required.', 400);
  }

  session.address = resolvedAddress;
  session.status = 'address_set';
  checkoutSessions.set(checkoutSessionId, session);

  return {
    checkoutSessionId,
    address: resolvedAddress,
    message: 'Delivery address saved successfully.',
  };
};

/**
 * GET /checkout/review
 * Return the full order summary for the checkout session.
 */
const reviewOrder = async ({ checkoutSessionId, userId, guestId }) => {
  const session = getSession(checkoutSessionId, userId, guestId);

  if (!session.address) {
    throw new AppError('Please provide a delivery address before reviewing the order.', 400);
  }

  // Re-confirm stock at review time
  const items = await getCartItems(session.cartId);
  for (const item of items) {
    if (item.stock_quantity < item.quantity) {
      throw new AppError(
        `Insufficient stock for product "${item.product_name}". Only ${item.stock_quantity} unit(s) available.`,
        409
      );
    }
  }

  return {
    checkoutSessionId,
    cartId: session.cartId,
    items: items.map((item) => ({
      id: item.id,
      skuId: item.sku_id,
      productId: item.product_id,
      productName: item.product_name,
      attributes: item.attributes,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      lineTotal: (item.unit_price * item.quantity).toFixed(2),
      images: item.images ?? [],
    })),
    address: session.address,
    subtotal: session.subtotal,
    discountAmount: session.discountAmount,
    total: session.total,
    promo: session.promo
      ? {
          code: session.promo.code,
          discountType: session.promo.discount_type,
          discountValue: session.promo.discount_value,
        }
      : null,
  };
};

/**
 * Delegate to the payments module to create a payment intent.
 * This avoids circular imports by doing a DB-level or internal service call.
 */
const delegatePaymentIntent = async ({ orderId, amount, currency, paymentMethod }) => {
  // Insert a pending payment record and return a client-facing payment token/intent id
  const intentId = `pi_${uuidv4().replace(/-/g, '')}`;

  await db.query(
    `INSERT INTO payments (id, order_id, amount, currency, payment_method, status, created_at)
     VALUES ($1, $2, $3, $4, $5, 'pending', NOW())`,
    [intentId, orderId, amount, currency ?? 'USD', paymentMethod]
  );

  return { paymentIntentId: intentId, clientSecret: `${intentId}_secret` };
};

/**
 * Reserve (decrement) stock for each SKU in the order.
 */
const reserveStock = async (items, client) => {
  for (const item of items) {
    const result = await client.query(
      `UPDATE skus
       SET stock_quantity = stock_quantity - $1
       WHERE id = $2 AND stock_quantity >= $1
       RETURNING id, stock_quantity`,
      [item.quantity, item.sku_id]
    );

    if (result.rows.length === 0) {
      throw new AppError(
        `Insufficient stock for product "${item.product_name}". Only available stock has been reserved.`,
        409
      );
    }
  }
};

/**
 * Finalise a promo code: mark it as used if it is single-use.
 */
const finalisePromo = async (promoCodeId, userId, client) => {
  if (!promoCodeId) return;

  // Record promo code usage
  await client.query(
    `INSERT INTO promo_code_usages (promo_code_id, user_id, used_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT DO NOTHING`,
    [promoCodeId, userId ?? null]
  );

  // Decrement remaining uses if applicable
  await client.query(
    `UPDATE promo_codes
     SET remaining_uses = GREATEST(remaining_uses - 1, 0)
     WHERE id = $1 AND remaining_uses IS NOT NULL`,
    [promoCodeId]
  );
};

/**
 * POST /checkout/place-order
 * Confirm stock, finalise promo, create the order and order items,
 * then delegate payment intent creation.
 */
const placeOrder = async ({ checkoutSessionId, paymentMethod, userId, guestId }) => {
  const session = getSession(checkoutSessionId, userId, guestId);

  if (!session.address) {
    throw new AppError('Please provide a delivery address before placing the order.', 400);
  }

  if (!paymentMethod) {
    throw new AppError('paymentMethod is required.', 400);
  }

  const items = await getCartItems(session.cartId);

  if (items.length === 0) {
    throw new AppError('Cart is empty. Cannot place an order.', 400);
  }

  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    // 1. Confirm and reserve stock
    await reserveStock(items, client);

    // 2. Finalise promo code
    const promoCodeId = session.promo?.id ?? null;
    await finalisePromo(promoCodeId, userId, client);

    // 3. Build delivery address JSON
    const deliveryAddress = session.address;

    // 4. Create the order record
    const orderId = uuidv4();
    await client.query(
      `INSERT INTO orders (
         id, user_id, guest_id, cart_id, promo_code_id,
         subtotal, discount_amount, total,
         delivery_address, payment_method, status, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', NOW(), NOW())`,
      [
        orderId,
        userId ?? null,
        guestId ?? null,
        session.cartId,
        promoCodeId,
        session.subtotal,
        session.discountAmount,
        session.total,
        JSON.stringify(deliveryAddress),
        paymentMethod,
      ]
    );

    // 5. Insert order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (id, order_id, sku_id, quantity, unit_price, line_total)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          uuidv4(),
          orderId,
          item.sku_id,
          item.quantity,
          item.unit_price,
          (item.unit_price * item.quantity).toFixed(2),
        ]
      );
    }

    // 6. Delegate payment intent creation
    const paymentIntent = await delegatePaymentIntent({
      orderId,
      amount: session.total,
      currency: 'USD',
      paymentMethod,
    });

    // 7. Link payment intent to order
    await client.query(
      `UPDATE orders SET payment_intent_id = $1, updated_at = NOW() WHERE id = $2`,
      [paymentIntent.paymentIntentId, orderId]
    );

    // 8. Mark cart as checked out
    await client.query(
      `UPDATE carts SET status = 'checked_out', updated_at = NOW() WHERE id = $1`,
      [session.cartId]
    );

    await client.query('COMMIT');

    // 9. Invalidate checkout session
    checkoutSessions.delete(checkoutSessionId);

    return {
      orderId,
      status: 'pending',
      total: session.total,
      paymentIntentId: paymentIntent.paymentIntentId,
      clientSecret: paymentIntent.clientSecret,
      message: 'Order placed successfully.',
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const checkoutService = {
  startCheckout,
  saveAddress,
  reviewOrder,
  placeOrder,
};
