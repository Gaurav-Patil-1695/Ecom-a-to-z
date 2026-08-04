import { query, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateSearch = [
  query('q')
    .optional()
    .isString()
    .withMessage('q must be a string')
    .trim()
    .isLength({ max: 200 })
    .withMessage('q must not exceed 200 characters'),

  query('category')
    .optional()
    .isString()
    .withMessage('category must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('category must not exceed 100 characters'),

  query('brand')
    .optional()
    .isString()
    .withMessage('brand must be a string')
    .trim()
    .isLength({ max: 100 })
    .withMessage('brand must not exceed 100 characters'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice must be a non-negative number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice must be a non-negative number')
    .custom((value, { req }) => {
      if (
        req.query.minPrice !== undefined &&
        parseFloat(value) < parseFloat(req.query.minPrice)
      ) {
        throw new Error('maxPrice must be greater than or equal to minPrice');
      }
      return true;
    }),

  query('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('rating must be a number between 0 and 5'),

  query('sort')
    .optional()
    .isIn(['relevance', 'price_asc', 'price_desc', 'newest', 'rating'])
    .withMessage('sort must be one of: relevance, price_asc, price_desc, newest, rating'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit must be an integer between 1 and 100'),

  handleValidationErrors,
];

export const validateSuggest = [
  query('q')
    .notEmpty()
    .withMessage('q is required')
    .isString()
    .withMessage('q must be a string')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('q must be between 1 and 200 characters'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('limit must be an integer between 1 and 20'),

  handleValidationErrors,
];
