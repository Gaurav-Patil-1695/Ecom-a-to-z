import { body, param, query } from 'express-validator';
import { validationResult } from 'express-validator';

// ─── Reusable middleware ──────────────────────────────────────────────────────

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// ─── Order ID param ───────────────────────────────────────────────────────────

export const validateOrderIdParam = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),
  validate,
];

// ─── List orders query ────────────────────────────────────────────────────────

const VALID_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'return_requested',
];

export const validateListOrdersQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),
  query('status')
    .optional()
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
  query('sort')
    .optional()
    .isIn(['created_at', 'total_amount'])
    .withMessage('sort must be one of: created_at, total_amount'),
  validate,
];

// ─── Cancel order body ────────────────────────────────────────────────────────

export const validateCancelOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),
  body('reason')
    .optional()
    .isString()
    .withMessage('reason must be a string')
    .isLength({ max: 500 })
    .withMessage('reason must not exceed 500 characters'),
  validate,
];

// ─── Advance order body ───────────────────────────────────────────────────────

export const validateAdvanceOrder = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),
  body('status')
    .notEmpty()
    .withMessage('status is required')
    .isIn(VALID_STATUSES)
    .withMessage(`status must be one of: ${VALID_STATUSES.join(', ')}`),
  validate,
];

// ─── Create return request body ───────────────────────────────────────────────

export const validateCreateReturnRequest = [
  param('orderId')
    .notEmpty()
    .withMessage('Order ID is required')
    .isUUID()
    .withMessage('Order ID must be a valid UUID'),
  body('reason')
    .notEmpty()
    .withMessage('Return reason is required')
    .isString()
    .withMessage('reason must be a string')
    .isLength({ max: 1000 })
    .withMessage('reason must not exceed 1000 characters'),
  body('items')
    .optional()
    .isArray()
    .withMessage('items must be an array'),
  body('items.*.orderItemId')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('Each return item must have an orderItemId')
    .isUUID()
    .withMessage('orderItemId must be a valid UUID'),
  body('items.*.quantity')
    .if(body('items').exists())
    .notEmpty()
    .withMessage('Each return item must have a quantity')
    .isInt({ min: 1 })
    .withMessage('quantity must be a positive integer'),
  validate,
];
