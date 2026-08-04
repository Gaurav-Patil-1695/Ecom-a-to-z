import Joi from 'joi';
import { AppError } from '../../utils/AppError.js';

const makeValidator = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return next(new AppError(message, 400));
  }
  return next();
};

// POST /checkout/start
const startSchema = Joi.object({
  cartId: Joi.string().uuid().required().messages({
    'string.base': 'cartId must be a string.',
    'string.guid': 'cartId must be a valid UUID.',
    'any.required': 'cartId is required.',
  }),
});

// POST /checkout/address
const addressObjectSchema = Joi.object({
  fullName: Joi.string().trim().min(1).max(150).required().messages({
    'string.base': 'fullName must be a string.',
    'string.empty': 'fullName is required.',
    'string.min': 'fullName is required.',
    'string.max': 'fullName must not exceed 150 characters.',
    'any.required': 'fullName is required.',
  }),
  phone: Joi.string().trim().min(1).max(30).required().messages({
    'string.base': 'phone must be a string.',
    'string.empty': 'phone is required.',
    'string.min': 'phone is required.',
    'string.max': 'phone must not exceed 30 characters.',
    'any.required': 'phone is required.',
  }),
  addressLine1: Joi.string().trim().min(1).max(255).required().messages({
    'string.base': 'addressLine1 must be a string.',
    'string.empty': 'addressLine1 is required.',
    'string.min': 'addressLine1 is required.',
    'string.max': 'addressLine1 must not exceed 255 characters.',
    'any.required': 'addressLine1 is required.',
  }),
  addressLine2: Joi.string().trim().max(255).optional().allow('', null).messages({
    'string.max': 'addressLine2 must not exceed 255 characters.',
  }),
  city: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'city must be a string.',
    'string.empty': 'city is required.',
    'string.min': 'city is required.',
    'string.max': 'city must not exceed 100 characters.',
    'any.required': 'city is required.',
  }),
  state: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'state must be a string.',
    'string.empty': 'state is required.',
    'string.min': 'state is required.',
    'string.max': 'state must not exceed 100 characters.',
    'any.required': 'state is required.',
  }),
  postalCode: Joi.string().trim().min(1).max(20).required().messages({
    'string.base': 'postalCode must be a string.',
    'string.empty': 'postalCode is required.',
    'string.min': 'postalCode is required.',
    'string.max': 'postalCode must not exceed 20 characters.',
    'any.required': 'postalCode is required.',
  }),
  country: Joi.string().trim().min(1).max(100).required().messages({
    'string.base': 'country must be a string.',
    'string.empty': 'country is required.',
    'string.min': 'country is required.',
    'string.max': 'country must not exceed 100 characters.',
    'any.required': 'country is required.',
  }),
});

const addressSchema = Joi.object({
  checkoutSessionId: Joi.string().uuid().required().messages({
    'string.base': 'checkoutSessionId must be a string.',
    'string.guid': 'checkoutSessionId must be a valid UUID.',
    'any.required': 'checkoutSessionId is required.',
  }),
  addressId: Joi.string().uuid().optional().messages({
    'string.base': 'addressId must be a string.',
    'string.guid': 'addressId must be a valid UUID.',
  }),
  address: addressObjectSchema.optional(),
})
  .or('addressId', 'address')
  .messages({
    'object.missing': 'Either addressId or address is required.',
  });

// POST /checkout/place-order
const placeOrderSchema = Joi.object({
  checkoutSessionId: Joi.string().uuid().required().messages({
    'string.base': 'checkoutSessionId must be a string.',
    'string.guid': 'checkoutSessionId must be a valid UUID.',
    'any.required': 'checkoutSessionId is required.',
  }),
  paymentMethod: Joi.string().trim().min(1).required().messages({
    'string.base': 'paymentMethod must be a string.',
    'string.empty': 'paymentMethod is required.',
    'string.min': 'paymentMethod is required.',
    'any.required': 'paymentMethod is required.',
  }),
});

export const checkoutValidator = {
  validateStart: makeValidator(startSchema),
  validateAddress: makeValidator(addressSchema),
  validatePlaceOrder: makeValidator(placeOrderSchema),
};
