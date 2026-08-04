import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middleware/auth.middleware.js';
import * as promotionsController from './promotions.controller.js';
import { validatePromoCode, validateCreatePromoCode, validateUpdatePromoCode } from './promotions.validator.js';

const router = Router();

// Promo validation endpoint (authenticated users)
router.post(
  '/carts/:cartId/promo',
  authenticate,
  validatePromoCode,
  promotionsController.applyPromoCode
);

// Admin CRUD for promo codes
router.get(
  '/admin/promo-codes',
  authenticate,
  requireAdmin,
  promotionsController.listPromoCodes
);

router.post(
  '/admin/promo-codes',
  authenticate,
  requireAdmin,
  validateCreatePromoCode,
  promotionsController.createPromoCode
);

router.get(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireAdmin,
  promotionsController.getPromoCode
);

router.put(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireAdmin,
  validateUpdatePromoCode,
  promotionsController.updatePromoCode
);

router.delete(
  '/admin/promo-codes/:promoCodeId',
  authenticate,
  requireAdmin,
  promotionsController.deletePromoCode
);

export default router;
