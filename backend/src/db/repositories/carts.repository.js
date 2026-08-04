import db from '../client.js';

const CARTS_TABLE = 'carts';
const ITEMS_TABLE = 'cart_items';

// ---------------------------------------------------------------------------
// Carts
// ---------------------------------------------------------------------------

export async function findById(id) {
  return db(CARTS_TABLE).where({ id }).first();
}

export async function findByUserId(userId) {
  return db(CARTS_TABLE).where({ user_id: userId }).first();
}

export async function findBySessionId(sessionId) {
  return db(CARTS_TABLE).where({ session_id: sessionId }).first();
}

export async function findByIdWithItems(id) {
  const cart = await db(CARTS_TABLE).where({ id }).first();
  if (!cart) return null;
  const items = await findItemsByCartId(id);
  return { ...cart, items };
}

export async function findByUserIdWithItems(userId) {
  const cart = await findByUserId(userId);
  if (!cart) return null;
  const items = await findItemsByCartId(cart.id);
  return { ...cart, items };
}

export async function findBySessionIdWithItems(sessionId) {
  const cart = await findBySessionId(sessionId);
  if (!cart) return null;
  const items = await findItemsByCartId(cart.id);
  return { ...cart, items };
}

export async function create(data) {
  const [id] = await db(CARTS_TABLE).insert(data);
  return findById(id);
}

export async function update(id, data) {
  await db(CARTS_TABLE).where({ id }).update(data);
  return findById(id);
}

export async function remove(id) {
  return db(CARTS_TABLE).where({ id }).delete();
}

export async function setPromoCode(id, promoCodeId, discountAmount) {
  await db(CARTS_TABLE).where({ id }).update({
    promo_code_id: promoCodeId,
    discount_amount: discountAmount,
  });
  return findById(id);
}

export async function clearPromoCode(id) {
  await db(CARTS_TABLE).where({ id }).update({
    promo_code_id: null,
    discount_amount: 0,
  });
  return findById(id);
}

export async function assignToUser(id, userId) {
  await db(CARTS_TABLE).where({ id }).update({ user_id: userId, session_id: null });
  return findById(id);
}

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return db(CARTS_TABLE).limit(limit).offset(offset).select('*');
}

export async function count() {
  const [{ total }] = await db(CARTS_TABLE).count('id as total');
  return Number(total);
}

// ---------------------------------------------------------------------------
// Cart Items
// ---------------------------------------------------------------------------

export async function findItemById(id) {
  return db(ITEMS_TABLE).where({ id }).first();
}

export async function findItemsByCartId(cartId) {
  return db(ITEMS_TABLE)
    .where({ cart_id: cartId })
    .select('*');
}

export async function findItemsByCartIdWithSku(cartId) {
  return db(ITEMS_TABLE)
    .select(
      `${ITEMS_TABLE}.*`,
      'skus.sku as sku_code',
      'skus.price as sku_price',
      'skus.stock_quantity',
      'skus.is_active as sku_is_active',
      'products.name as product_name',
      'products.slug as product_slug',
      'products.is_active as product_is_active'
    )
    .where(`${ITEMS_TABLE}.cart_id`, cartId)
    .leftJoin('skus', `${ITEMS_TABLE}.sku_id`, 'skus.id')
    .leftJoin('products', 'skus.product_id', 'products.id');
}

export async function findItemByCartIdAndSkuId(cartId, skuId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId, sku_id: skuId }).first();
}

export async function findItemByIdAndCartId(id, cartId) {
  return db(ITEMS_TABLE).where({ id, cart_id: cartId }).first();
}

export async function addItem(data) {
  const [id] = await db(ITEMS_TABLE).insert(data);
  return findItemById(id);
}

export async function updateItem(id, data) {
  await db(ITEMS_TABLE).where({ id }).update(data);
  return findItemById(id);
}

export async function updateItemByIdAndCartId(id, cartId, data) {
  await db(ITEMS_TABLE).where({ id, cart_id: cartId }).update(data);
  return findItemById(id);
}

export async function removeItem(id) {
  return db(ITEMS_TABLE).where({ id }).delete();
}

export async function removeItemByIdAndCartId(id, cartId) {
  return db(ITEMS_TABLE).where({ id, cart_id: cartId }).delete();
}

export async function removeItemsByCartId(cartId) {
  return db(ITEMS_TABLE).where({ cart_id: cartId }).delete();
}

export async function countItemsByCartId(cartId) {
  const [{ total }] = await db(ITEMS_TABLE)
    .where({ cart_id: cartId })
    .count('id as total');
  return Number(total);
}

export async function upsertItem(cartId, skuId, quantity, unitPrice) {
  const existing = await findItemByCartIdAndSkuId(cartId, skuId);
  if (existing) {
    await db(ITEMS_TABLE)
      .where({ id: existing.id })
      .update({ quantity, unit_price: unitPrice });
    return findItemById(existing.id);
  }
  return addItem({ cart_id: cartId, sku_id: skuId, quantity, unit_price: unitPrice });
}

export async function incrementItemQuantity(id, amount = 1) {
  await db(ITEMS_TABLE).where({ id }).increment('quantity', amount);
  return findItemById(id);
}

export async function decrementItemQuantity(id, amount = 1) {
  await db(ITEMS_TABLE)
    .where({ id })
    .where('quantity', '>', amount)
    .decrement('quantity', amount);
  return findItemById(id);
}

export async function clearCart(cartId) {
  return db.transaction(async (trx) => {
    await trx(ITEMS_TABLE).where({ cart_id: cartId }).delete();
    await trx(CARTS_TABLE).where({ id: cartId }).update({
      promo_code_id: null,
      discount_amount: 0,
    });
    return trx(CARTS_TABLE).where({ id: cartId }).first();
  });
}

export async function mergeGuestCartIntoUserCart(guestCartId, userCartId) {
  return db.transaction(async (trx) => {
    const guestItems = await trx(ITEMS_TABLE).where({ cart_id: guestCartId }).select('*');
    for (const guestItem of guestItems) {
      const existing = await trx(ITEMS_TABLE)
        .where({ cart_id: userCartId, sku_id: guestItem.sku_id })
        .first();
      if (existing) {
        await trx(ITEMS_TABLE)
          .where({ id: existing.id })
          .update({ quantity: existing.quantity + guestItem.quantity });
      } else {
        await trx(ITEMS_TABLE).insert({
          cart_id: userCartId,
          sku_id: guestItem.sku_id,
          quantity: guestItem.quantity,
          unit_price: guestItem.unit_price,
        });
      }
    }
    await trx(ITEMS_TABLE).where({ cart_id: guestCartId }).delete();
    await trx(CARTS_TABLE).where({ id: guestCartId }).delete();
    return trx(CARTS_TABLE).where({ id: userCartId }).first();
  });
}
