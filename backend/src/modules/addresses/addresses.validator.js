import Joi from 'joi';

const addressBodySchema = Joi.object({
  full_name: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'Full name must be a string.',
    'string.empty': 'Full name is required.',
    'string.min': 'Full name must be at least 1 character.',
    'string.max': 'Full name must be at most 100 characters.',
    'any.required': 'Full name is required.',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).required().messages({
    'string.base': 'Phone must be a string.',
    'string.empty': 'Phone is required.',
    'string.pattern.base': 'Phone must be a 10-digit number.',
    'any.required': 'Phone is required.',
  }),
  line1: Joi.string().trim().min(1).max(255).required().messages({
    'string.base': 'Address line 1 must be a string.',
    'string.empty': 'Address line 1 is required.',
    'string.min': 'Address line 1 must be at least 1 character.',
    'string.max': 'Address line 1 must be at most 255 characters.',
    'any.required': 'Address line 1 is required.',
  }),
  line2: Joi.string().trim().max(255).allow(null, '').optional().messages({
    'string.base': 'Address line 2 must be a string.',
    'string.max': 'Address line 2 must be at most 255 characters.',
  }),
  city: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'City must be a string.',
    'string.empty': 'City is required.',
    'string.min': 'City must be at least 1 character.',
    'string.max': 'City must be at most 100 characters.',
    'any.required': 'City is required.',
  }),
  state: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'State must be a string.',
    'string.empty': 'State is required.',
    'string.min': 'State must be at least 1 character.',
    'string.max': 'State must be at most 100 characters.',
    'any.required': 'State is required.',
  }),
  pin_code: Joi.string().trim().pattern(/^[0-9]{6}$/).required().messages({
    'string.base': 'Pin code must be a string.',
    'string.empty': 'Pin code is required.',
    'string.pattern.base': 'Pin code must be a 6-digit number.',
    'any.required': 'Pin code is required.',
  }),
  is_default: Joi.boolean().optional().messages({
    'boolean.base': 'is_default must be a boolean.',
  }),
});

const updateAddressBodySchema = Joi.object({
  full_name: Joi.string().trim().min(1).max(100).optional().messages({
    'string.base': 'Full name must be a string.',
    'string.empty': 'Full name must not be empty.',
    'string.min': 'Full name must be at least 1 character.',
    'string.max': 'Full name must be at most 100 characters.',
  }),
  phone: Joi.string().trim().pattern(/^[0-9]{10}$/).optional().messages({
    'string.base': 'Phone must be a string.',
    'string.empty': 'Phone must not be empty.',
    'string.pattern.base': 'Phone must be a 10-digit number.',
  }),
  line1: Joi.string().trim().min(1).max(255).optional().messages({
    'string.base': 'Address line 1 must be a string.',
    'string.empty': 'Address line 1 must not be empty.',
    'string.min': 'Address line 1 must be at least 1 character.',
    'string.max': 'Address line 1 must be at most 255 characters.',
  }),
  line2: Joi.string().trim().max(255).allow(null, '').optional().messages({
    'string.base': 'Address line 2 must be a string.',
    'string.max': 'Address line 2 must be at most 255 characters.',
  }),
  city: Joi.string().trim().min(1).max(100).optional().messages({
    'string.base': 'City must be a string.',
    'string.empty': 'City must not be empty.',
    'string.min': 'City must be at least 1 character.',
    'string.max': 'City must be at most 100 characters.',
  }),
  state: Joi.string().trim().min(1).max(100).optional().messages({
    'string.base': 'State must be a string.',
    'string.empty': 'State must not be empty.',
    'string.min': 'State must be at least 1 character.',
    'string.max': 'State must be at most 100 characters.',
  }),
  pin_code: Joi.string().trim().pattern(/^[0-9]{6}$/).optional().messages({
    'string.base': 'Pin code must be a string.',
    'string.empty': 'Pin code must not be empty.',
    'string.pattern.base': 'Pin code must be a 6-digit number.',
  }),
  is_default: Joi.boolean().optional().messages({
    'boolean.base': 'is_default must be a boolean.',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update.',
});

const addressIdParamSchema = Joi.object({
  addressId: Joi.string().uuid().required().messages({
    'string.base': 'Address ID must be a string.',
    'string.guid': 'Address ID must be a valid UUID.',
    'any.required': 'Address ID is required.',
  }),
});

function validationMiddleware(schema, target = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[target], { abortEarly: false, stripUnknown: true });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    req[target] = value;
    return next();
  };
}

export const validateCreateAddress = validationMiddleware(addressBodySchema, 'body');
export const validateUpdateAddress = validationMiddleware(updateAddressBodySchema, 'body');
export const validateAddressId = validationMiddleware(addressIdParamSchema, 'params');
