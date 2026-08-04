import {
  createCartService,
  getCartService,
  addItemService,
  updateItemService,
  removeItemService,
  applyPromoService,
  removePromoService,
} from './cart.service.js';

export async function createCart(req, res, next) {
  try {
    const cart = await createCartService(req.body);
    return res.status(201).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function getCart(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await getCartService(cartId);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function addItem(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await addItemService(cartId, req.body);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function updateItem(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const cart = await updateItemService(cartId, itemId, req.body);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function removeItem(req, res, next) {
  try {
    const { cartId, itemId } = req.params;
    const cart = await removeItemService(cartId, itemId);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function applyPromo(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await applyPromoService(cartId, req.body);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}

export async function removePromo(req, res, next) {
  try {
    const { cartId } = req.params;
    const cart = await removePromoService(cartId);
    return res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
}
