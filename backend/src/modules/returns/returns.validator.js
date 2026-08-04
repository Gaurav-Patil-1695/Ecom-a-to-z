import Joi from 'joi';

/**
 * Validation schema for creating a return request
 * POST /orders/:orderId/return-requests
 */
export const createReturnRequestSchema = Joi.object({
  reason: Joi.string().trim().min(1).max(1000).required().messages({
    'string.base': 'Reason must be a string.',
    'string.empty': 'Reason is required.',
    'string.min': 'Reason must be at least 1 character.',
    'string.max': 'Reason must not exceed 1000 characters.',
    'any.required': 'Reason is required.',
  }),
  items: Joi.array()
    .items(
      Joi.object({
        sku_id: Joi.string().uuid().required().messages({
          'string.base': 'Item sku_id must be a string.',
          'string.empty': 'Item sku_id is required.',
          'string.guid': 'Item sku_id must be a valid UUID.',
          'any.required': 'Item sku_id is required.',
        }),
        quantity: Joi.number().integer().min(1).required().messages({
          'number.base': 'Item quantity must be a number.',
          'number.integer': 'Item quantity must be an integer.',
          'number.min': 'Item quantity must be at least 1.',
          'any.required': 'Item quantity is required.',
        }),
      })
    )
    .min(1)
    .optional()
    .messages({
      'array.base': 'Items must be an array.',
      'array.min': 'Items must contain at least one item.',
    }),
  comments: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.base': 'Comments must be a string.',
    'string.max': 'Comments must not exceed 2000 characters.',
  }),
});

/**
 * Validation schema for reviewing a return request
 * POST /return-requests/:returnRequestId/review
 */
export const reviewReturnRequestSchema = Joi.object({
  action: Joi.string().valid('approve', 'reject').required().messages({
    'string.base': 'Action must be a string.',
    'string.empty': 'Action is required.',
    'any.only': 'Action must be one of: approve, reject.',
    'any.required': 'Action is required.',
  }),
  adminNote: Joi.string().trim().max(2000).optional().allow('', null).messages({
    'string.base': 'Admin note must be a string.',
    'string.max': 'Admin note must not exceed 2000 characters.',
  }),
});
