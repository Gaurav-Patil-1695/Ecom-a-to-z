import Joi from 'joi';
import { createValidator } from '../../middleware/validator.middleware.js';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

/**
 * Schema for applying/validating a promo code against a cart.
 * POST /carts/:cartId/promo
 */
const promoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'Promo code must be a string',
    'string.empty': 'Promo code is required',
    'string.min': 'Promo code must be at least 1 character',
    'string.max': 'Promo code must not exceed 100 characters',
    'any.required': 'Promo code is required',
  }),
});

/**
 * Schema for creating a new promo code.
 * POST /admin/promo-codes
 */
const createPromoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'Code must be a string',
    'string.empty': 'Code is required',
    'string.min': 'Code must be at least 1 character',
    'string.max': 'Code must not exceed 100 characters',
    'any.required': 'Code is required',
  }),

  description: Joi.string().trim().max(500).allow(null, '').optional().messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must not exceed 500 characters',
  }),

  discount_type: Joi.string().valid('percentage', 'fixed').required().messages({
    'string.base': 'Discount type must be a string',
    'any.only': 'Discount type must be one of: percentage, fixed',
    'any.required': 'Discount type is required',
  }),

  discount_value: Joi.number().positive().required().messages({
    'number.base': 'Discount value must be a number',
    'number.positive': 'Discount value must be a positive number',
    'any.required': 'Discount value is required',
  }),

  max_discount_amount: Joi.number().positive().allow(null).optional().messages({
    'number.base': 'Max discount amount must be a number',
    'number.positive': 'Max discount amount must be a positive number',
  }),

  min_order_amount: Joi.number().min(0).allow(null).optional().messages({
    'number.base': 'Min order amount must be a number',
    'number.min': 'Min order amount must be at least 0',
  }),

  usage_limit: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'Usage limit must be a number',
    'number.integer': 'Usage limit must be an integer',
    'number.min': 'Usage limit must be at least 1',
  }),

  per_user_limit: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'Per user limit must be a number',
    'number.integer': 'Per user limit must be an integer',
    'number.min': 'Per user limit must be at least 1',
  }),

  starts_at: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'Starts at must be a valid date',
    'date.format': 'Starts at must be a valid ISO 8601 date',
  }),

  expires_at: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'Expires at must be a valid date',
    'date.format': 'Expires at must be a valid ISO 8601 date',
  }),

  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'Is active must be a boolean',
  }),
});

/**
 * Schema for updating an existing promo code.
 * PUT /admin/promo-codes/:promoCodeId
 * All fields are optional but at least one must be provided.
 */
const updatePromoCodeSchema = Joi.object({
  code: Joi.string().trim().min(1).max(100).optional().messages({
    'string.base': 'Code must be a string',
    'string.empty': 'Code must not be empty',
    'string.min': 'Code must be at least 1 character',
    'string.max': 'Code must not exceed 100 characters',
  }),

  description: Joi.string().trim().max(500).allow(null, '').optional().messages({
    'string.base': 'Description must be a string',
    'string.max': 'Description must not exceed 500 characters',
  }),

  discount_type: Joi.string().valid('percentage', 'fixed').optional().messages({
    'string.base': 'Discount type must be a string',
    'any.only': 'Discount type must be one of: percentage, fixed',
  }),

  discount_value: Joi.number().positive().optional().messages({
    'number.base': 'Discount value must be a number',
    'number.positive': 'Discount value must be a positive number',
  }),

  max_discount_amount: Joi.number().positive().allow(null).optional().messages({
    'number.base': 'Max discount amount must be a number',
    'number.positive': 'Max discount amount must be a positive number',
  }),

  min_order_amount: Joi.number().min(0).allow(null).optional().messages({
    'number.base': 'Min order amount must be a number',
    'number.min': 'Min order amount must be at least 0',
  }),

  usage_limit: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'Usage limit must be a number',
    'number.integer': 'Usage limit must be an integer',
    'number.min': 'Usage limit must be at least 1',
  }),

  per_user_limit: Joi.number().integer().min(1).allow(null).optional().messages({
    'number.base': 'Per user limit must be a number',
    'number.integer': 'Per user limit must be an integer',
    'number.min': 'Per user limit must be at least 1',
  }),

  starts_at: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'Starts at must be a valid date',
    'date.format': 'Starts at must be a valid ISO 8601 date',
  }),

  expires_at: Joi.date().iso().allow(null).optional().messages({
    'date.base': 'Expires at must be a valid date',
    'date.format': 'Expires at must be a valid ISO 8601 date',
  }),

  is_active: Joi.boolean().optional().messages({
    'boolean.base': 'Is active must be a boolean',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

// ---------------------------------------------------------------------------
// Middleware exports
// ---------------------------------------------------------------------------

export const validatePromoCode = createValidator(promoCodeSchema, 'body');
export const validateCreatePromoCode = createValidator(createPromoCodeSchema, 'body');
export const validateUpdatePromoCode = createValidator(updatePromoCodeSchema, 'body');
