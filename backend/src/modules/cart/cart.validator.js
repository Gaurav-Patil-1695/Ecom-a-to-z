import { body, validationResult } from 'express-validator';

/**
 * Middleware to collect validation errors and respond with 400 if any exist.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation for POST /carts
 * Accepts optional user_id, guest_id, and guest_cart_id.
 */
export const validateCreateCart = [
  body('user_id')
    .optional({ nullable: true })
    .isString()
    .withMessage('user_id must be a string.'),

  body('guest_id')
    .optional({ nullable: true })
    .isString()
    .withMessage('guest_id must be a string.'),

  body('guest_cart_id')
    .optional({ nullable: true })
    .isString()
    .withMessage('guest_cart_id must be a string.'),

  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/items
 */
export const validateAddItem = [
  body('product_id')
    .notEmpty()
    .withMessage('product_id is required.')
    .isString()
    .withMessage('product_id must be a string.'),

  body('sku_id')
    .notEmpty()
    .withMessage('sku_id is required.')
    .isString()
    .withMessage('sku_id must be a string.'),

  body('quantity')
    .notEmpty()
    .withMessage('quantity is required.')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer.'),

  handleValidationErrors,
];

/**
 * Validation for PATCH /carts/:cartId/items/:itemId
 */
export const validateUpdateItem = [
  body('quantity')
    .notEmpty()
    .withMessage('quantity is required.')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer.'),

  handleValidationErrors,
];

/**
 * Validation for POST /carts/:cartId/promo
 */
export const validateApplyPromo = [
  body('code')
    .notEmpty()
    .withMessage('Promo code is required.')
    .isString()
    .withMessage('Promo code must be a string.'),

  handleValidationErrors,
];
