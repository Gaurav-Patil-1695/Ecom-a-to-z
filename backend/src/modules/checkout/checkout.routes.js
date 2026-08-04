import { Router } from 'express';
import { checkoutController } from './checkout.controller.js';
import { checkoutValidator } from './checkout.validator.js';
import { authenticate, optionalAuthenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// POST /checkout/start — initiate a checkout session (guest or authenticated)
router.post(
  '/start',
  optionalAuthenticate,
  checkoutValidator.validateStart,
  checkoutController.start
);

// POST /checkout/address — save or select a delivery address for the current checkout
router.post(
  '/address',
  optionalAuthenticate,
  checkoutValidator.validateAddress,
  checkoutController.address
);

// GET /checkout/review — retrieve the full order summary before placement
router.get(
  '/review',
  optionalAuthenticate,
  checkoutController.review
);

// POST /checkout/place-order — confirm and place the order
router.post(
  '/place-order',
  optionalAuthenticate,
  checkoutValidator.validatePlaceOrder,
  checkoutController.placeOrder
);

export { router as checkoutRouter };
