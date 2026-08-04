import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
  name: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Name must be at most 100 characters.',
  }),
  phone: Joi.string().trim().max(20).optional().messages({
    'string.max': 'Phone must be at most 20 characters.',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
});

export const logoutSchema = Joi.object({
  token: Joi.string().optional(),
}).unknown(true);

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address.',
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
  }),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Token is required.',
    'any.required': 'Token is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters.',
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
});

export const guestRegisterSchema = Joi.object({
  email: Joi.string().email().optional().messages({
    'string.email': 'Please enter a valid email address.',
  }),
  name: Joi.string().trim().max(100).optional().messages({
    'string.max': 'Name must be at most 100 characters.',
  }),
  phone: Joi.string().trim().max(20).optional().messages({
    'string.max': 'Phone must be at most 20 characters.',
  }),
});

/**
 * Express middleware factory that validates req.body against a Joi schema.
 * On failure it responds with 422 and the first validation message.
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: true, stripUnknown: true });
    if (error) {
      return res.status(422).json({ message: error.details[0].message });
    }
    req.body = value;
    return next();
  };
}
