import { body, validationResult } from 'express-validator';

/**
 * Middleware to collect validation errors and return a 422 response if any exist.
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
}

/**
 * Validation schema for PATCH /users/me
 * Allows updating first_name, last_name, and phone.
 */
export const validateUpdateMe = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('First name must not be empty.')
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Last name must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters.'),

  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^[+]?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  handleValidationErrors,
];

/**
 * Validation schema for POST /users/me/change-password
 */
export const validateChangePassword = [
  body('current_password')
    .exists({ checkFalsy: true })
    .withMessage('Current password is required.')
    .isString()
    .withMessage('Current password must be a string.'),

  body('new_password')
    .exists({ checkFalsy: true })
    .withMessage('New password is required.')
    .isString()
    .withMessage('New password must be a string.')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter.')
    .matches(/[a-z]/)
    .withMessage('New password must contain at least one lowercase letter.')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number.'),

  body('confirm_password')
    .optional()
    .custom((value, { req }) => {
      if (value !== undefined && value !== req.body.new_password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Validation schema for PATCH /users/:userId (admin)
 * Allows updating first_name, last_name, phone, role, and is_active.
 */
export const validateUpdateUser = [
  body('first_name')
    .optional()
    .isString()
    .withMessage('First name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('First name must not be empty.')
    .isLength({ max: 100 })
    .withMessage('First name must not exceed 100 characters.'),

  body('last_name')
    .optional()
    .isString()
    .withMessage('Last name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Last name must not be empty.')
    .isLength({ max: 100 })
    .withMessage('Last name must not exceed 100 characters.'),

  body('phone')
    .optional({ nullable: true })
    .isString()
    .withMessage('Phone must be a string.')
    .trim()
    .matches(/^[+]?[0-9\s\-().]{7,20}$/)
    .withMessage('Phone number is invalid.'),

  body('role')
    .optional()
    .isString()
    .withMessage('Role must be a string.')
    .isIn(['customer', 'admin'])
    .withMessage('Role must be one of: customer, admin.'),

  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be a boolean.')
    .toBoolean(),

  handleValidationErrors,
];
