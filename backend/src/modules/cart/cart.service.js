import db from '../../../db/index.js';
import { AppError } from '../../../utils/AppError.js';

/**
 * Build the full cart response object from the database
 */
async function buildCartResponse(cartId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const items = await db('cart_items')
    .where({ cart_id: cartId })
    .orderBy('created_at', 'asc');

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.unit_price) * item.quantity;
  }, 0);

  let discount = 0;
  let promoCode = null;

  if (cart.promo_code_id) {
    const promo = await db('promo_codes').where({ id: cart.promo_code_id }).first();
    if (promo) {
      promoCode = promo.code;
      if (promo.discount_type === 'percentage') {
        discount = subtotal * (Number(promo.discount_value) / 100);
        if (promo.max_discount_amount && discount > Number(promo.max_discount_amount)) {
          discount = Number(promo.max_discount_amount);
        }
      } else if (promo.discount_type === 'fixed') {
        discount = Math.min(Number(promo.discount_value), subtotal);
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  return {
    id: cart.id,
    user_id: cart.user_id,
    guest_id: cart.guest_id,
    promo_code: promoCode,
    promo_code_id: cart.promo_code_id,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    total: Number(total.toFixed(2)),
    items: items.map((item) => ({
      id: item.id,
      cart_id: item.cart_id,
      product_id: item.product_id,
      sku_id: item.sku_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      name: item.name,
      image_url: item.image_url,
      variant_label: item.variant_label,
    })),
    created_at: cart.created_at,
    updated_at: cart.updated_at,
  };
}

/**
 * Validate that the requested quantity is available in stock
 */
async function validateStock(skuId, requestedQty, excludeCartItemId = null) {
  const sku = await db('product_skus').where({ id: skuId }).first();
  if (!sku) {
    throw new AppError('Product SKU not found.', 404);
  }

  const availableStock = Number(sku.stock_quantity);

  // Compute how much is already reserved in OTHER carts
  let reservedQuery = db('cart_items').where({ sku_id: skuId }).sum('quantity as reserved');
  if (excludeCartItemId) {
    reservedQuery = reservedQuery.whereNot({ id: excludeCartItemId });
  }
  const reservedResult = await reservedQuery.first();
  const reservedElsewhere = Number(reservedResult.reserved) || 0;

  const freeStock = availableStock - reservedElsewhere;

  if (requestedQty > freeStock) {
    throw new AppError(
      `Insufficient stock. Only ${freeStock} unit(s) available for this SKU.`,
      409
    );
  }

  return sku;
}

/**
 * Merge a guest cart into an authenticated user's cart.
 * Items from the guest cart are added to the user cart;
 * quantities are summed and stock is re-validated.
 * The guest cart is then deleted.
 */
async function mergeGuestCart(guestCartId, userCartId) {
  const guestItems = await db('cart_items').where({ cart_id: guestCartId });

  for (const guestItem of guestItems) {
    const existingItem = await db('cart_items')
      .where({ cart_id: userCartId, sku_id: guestItem.sku_id })
      .first();

    if (existingItem) {
      const newQty = existingItem.quantity + guestItem.quantity;
      // Validate merged quantity (exclude the existing user-cart item from reservation count)
      await validateStock(guestItem.sku_id, newQty, existingItem.id);
      await db('cart_items').where({ id: existingItem.id }).update({ quantity: newQty, updated_at: db.fn.now() });
    } else {
      await validateStock(guestItem.sku_id, guestItem.quantity);
      await db('cart_items').insert({
        cart_id: userCartId,
        product_id: guestItem.product_id,
        sku_id: guestItem.sku_id,
        quantity: guestItem.quantity,
        unit_price: guestItem.unit_price,
        name: guestItem.name,
        image_url: guestItem.image_url,
        variant_label: guestItem.variant_label,
      });
    }
  }

  // Remove all guest cart items and the guest cart itself
  await db('cart_items').where({ cart_id: guestCartId }).delete();
  await db('carts').where({ id: guestCartId }).delete();
}

/**
 * POST /carts
 * Create a new cart. Supports guest and authenticated users.
 * If an authenticated user provides a guest_cart_id, merge the guest cart.
 */
export async function createCartService(body) {
  const { user_id = null, guest_id = null, guest_cart_id = null } = body;

  // If authenticated user already has a cart, return it (or merge)
  if (user_id) {
    const existingUserCart = await db('carts').where({ user_id }).first();
    if (existingUserCart) {
      if (guest_cart_id) {
        const guestCart = await db('carts').where({ id: guest_cart_id }).first();
        if (guestCart && guestCart.user_id === null) {
          await mergeGuestCart(guest_cart_id, existingUserCart.id);
        }
      }
      return buildCartResponse(existingUserCart.id);
    }
  }

  // Create a new cart
  const [newCart] = await db('carts')
    .insert({ user_id, guest_id })
    .returning('*');

  const cartId = newCart.id;

  // Merge guest cart into the newly created user cart
  if (user_id && guest_cart_id) {
    const guestCart = await db('carts').where({ id: guest_cart_id }).first();
    if (guestCart && guestCart.user_id === null) {
      await mergeGuestCart(guest_cart_id, cartId);
    }
  }

  return buildCartResponse(cartId);
}

/**
 * GET /carts/:cartId
 */
export async function getCartService(cartId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }
  return buildCartResponse(cartId);
}

/**
 * POST /carts/:cartId/items
 * Add an item to the cart. If the SKU already exists, increment quantity.
 */
export async function addItemService(cartId, body) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const { product_id, sku_id, quantity } = body;

  if (!product_id || !sku_id || !quantity || quantity < 1) {
    throw new AppError('product_id, sku_id, and a positive quantity are required.', 400);
  }

  // Check if item already exists in cart
  const existingItem = await db('cart_items').where({ cart_id: cartId, sku_id }).first();

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    await validateStock(sku_id, newQty, existingItem.id);
    await db('cart_items')
      .where({ id: existingItem.id })
      .update({ quantity: newQty, updated_at: db.fn.now() });
  } else {
    const sku = await validateStock(sku_id, quantity);

    // Fetch product info for denormalized fields
    const product = await db('products').where({ id: product_id }).first();
    if (!product) {
      throw new AppError('Product not found.', 404);
    }

    // Build variant label from sku attributes if available
    let variantLabel = null;
    if (sku.attributes) {
      const attrs = typeof sku.attributes === 'string' ? JSON.parse(sku.attributes) : sku.attributes;
      variantLabel = Object.entries(attrs)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
    }

    // Resolve image
    let imageUrl = null;
    const productImage = await db('product_images')
      .where({ product_id })
      .orderBy('position', 'asc')
      .first();
    if (productImage) {
      imageUrl = productImage.url;
    }

    const unitPrice = sku.sale_price || sku.price;

    await db('cart_items').insert({
      cart_id: cartId,
      product_id,
      sku_id,
      quantity,
      unit_price: unitPrice,
      name: product.name,
      image_url: imageUrl,
      variant_label: variantLabel,
    });
  }

  // Touch cart updated_at
  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return buildCartResponse(cartId);
}

/**
 * PATCH /carts/:cartId/items/:itemId
 * Update the quantity of a specific cart item.
 */
export async function updateItemService(cartId, itemId, body) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const item = await db('cart_items').where({ id: itemId, cart_id: cartId }).first();
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  const { quantity } = body;

  if (quantity === undefined || quantity < 1) {
    throw new AppError('A positive quantity is required.', 400);
  }

  // Validate stock for the new quantity, excluding the current item from reserved count
  await validateStock(item.sku_id, quantity, itemId);

  await db('cart_items').where({ id: itemId }).update({ quantity, updated_at: db.fn.now() });
  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return buildCartResponse(cartId);
}

/**
 * DELETE /carts/:cartId/items/:itemId
 * Remove an item from the cart.
 */
export async function removeItemService(cartId, itemId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const item = await db('cart_items').where({ id: itemId, cart_id: cartId }).first();
  if (!item) {
    throw new AppError('Cart item not found.', 404);
  }

  await db('cart_items').where({ id: itemId }).delete();
  await db('carts').where({ id: cartId }).update({ updated_at: db.fn.now() });

  return buildCartResponse(cartId);
}

/**
 * POST /carts/:cartId/promo
 * Apply a promo code to the cart.
 */
export async function applyPromoService(cartId, body) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  const { code } = body;
  if (!code) {
    throw new AppError('Promo code is required.', 400);
  }

  const promo = await db('promo_codes').where({ code }).first();
  if (!promo) {
    throw new AppError('Invalid promo code.', 422);
  }

  if (!promo.is_active) {
    throw new AppError('This promo code is no longer active.', 422);
  }

  const now = new Date();
  if (promo.valid_from && new Date(promo.valid_from) > now) {
    throw new AppError('This promo code is not yet valid.', 422);
  }
  if (promo.valid_until && new Date(promo.valid_until) < now) {
    throw new AppError('This promo code has expired.', 422);
  }

  if (promo.usage_limit !== null && promo.usage_count >= promo.usage_limit) {
    throw new AppError('This promo code has reached its usage limit.', 422);
  }

  // Validate minimum order amount
  const items = await db('cart_items').where({ cart_id: cartId });
  const subtotal = items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);

  if (promo.min_order_amount && subtotal < Number(promo.min_order_amount)) {
    throw new AppError(
      `A minimum order amount of ${promo.min_order_amount} is required for this promo code.`,
      422
    );
  }

  await db('carts').where({ id: cartId }).update({ promo_code_id: promo.id, updated_at: db.fn.now() });

  return buildCartResponse(cartId);
}

/**
 * DELETE /carts/:cartId/promo
 * Remove the applied promo code from the cart.
 */
export async function removePromoService(cartId) {
  const cart = await db('carts').where({ id: cartId }).first();
  if (!cart) {
    throw new AppError('Cart not found.', 404);
  }

  if (!cart.promo_code_id) {
    throw new AppError('No promo code is applied to this cart.', 422);
  }

  await db('carts').where({ id: cartId }).update({ promo_code_id: null, updated_at: db.fn.now() });

  return buildCartResponse(cartId);
}
