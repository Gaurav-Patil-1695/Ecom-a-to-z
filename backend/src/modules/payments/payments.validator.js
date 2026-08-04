import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../../middleware/handleValidationErrors.js';

export const validateInitiatePayment = [
  body('orderId')
    .notEmpty()
    .withMessage('orderId is required')
    .isString()
    .withMessage('orderId must be a string'),

  body('amount')
    .notEmpty()
    .withMessage('amount is required')
    .isNumeric()
    .withMessage('amount must be a number')
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error('amount must be greater than zero');
      }
      return true;
    }),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-character ISO code'),

  body('paymentMethod')
    .optional()
    .isString()
    .withMessage('paymentMethod must be a string'),

  handleValidationErrors,
];

export const validatePaymentCallback = [
  body('provider')
    .optional()
    .isString()
    .withMessage('provider must be a string'),

  body('reference')
    .optional()
    .isString()
    .withMessage('reference must be a string'),

  body('status')
    .optional()
    .isString()
    .withMessage('status must be a string'),

  body('attemptId')
    .optional()
    .isString()
    .withMessage('attemptId must be a string'),

  handleValidationErrors,
];

export const validatePaymentId = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId is required')
    .isString()
    .withMessage('paymentId must be a string'),

  handleValidationErrors,
];

export const validateRetryPayment = [
  param('paymentId')
    .notEmpty()
    .withMessage('paymentId is required')
    .isString()
    .withMessage('paymentId must be a string'),

  body('amount')
    .optional()
    .isNumeric()
    .withMessage('amount must be a number')
    .custom((value) => {
      if (value !== undefined && Number(value) <= 0) {
        throw new Error('amount must be greater than zero');
      }
      return true;
    }),

  body('currency')
    .optional()
    .isString()
    .withMessage('currency must be a string')
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-character ISO code'),

  handleValidationErrors,
];
