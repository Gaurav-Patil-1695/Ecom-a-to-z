import * as promotionsService from './promotions.service.js';

/**
 * POST /carts/:cartId/promo
 * Apply/validate a promo code to a cart
 */
export async function applyPromoCode(req, res, next) {
  try {
    const { cartId } = req.params;
    const { code } = req.body;
    const userId = req.user.id;

    const result = await promotionsService.applyPromoCode({ cartId, code, userId });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes
 * List all promo codes (admin)
 */
export async function listPromoCodes(req, res, next) {
  try {
    const { page, limit, active } = req.query;

    const result = await promotionsService.listPromoCodes({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      active: active !== undefined ? active === 'true' : undefined,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /admin/promo-codes
 * Create a new promo code (admin)
 */
export async function createPromoCode(req, res, next) {
  try {
    const promoCodeData = req.body;

    const created = await promotionsService.createPromoCode(promoCodeData);

    return res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /admin/promo-codes/:promoCodeId
 * Get a single promo code by ID (admin)
 */
export async function getPromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;

    const promoCode = await promotionsService.getPromoCodeById(promoCodeId);

    return res.status(200).json(promoCode);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /admin/promo-codes/:promoCodeId
 * Update a promo code (admin)
 */
export async function updatePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;
    const updateData = req.body;

    const updated = await promotionsService.updatePromoCode(promoCodeId, updateData);

    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /admin/promo-codes/:promoCodeId
 * Delete a promo code (admin)
 */
export async function deletePromoCode(req, res, next) {
  try {
    const { promoCodeId } = req.params;

    await promotionsService.deletePromoCode(promoCodeId);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
