/**
 * Generic validation middleware factory for Joi schemas.
 *
 * Validates a portion of the incoming request (body, query, or params)
 * against the provided Joi schema.
 *
 * On validation failure the request is rejected with HTTP 422 and a
 * structured error response of the form:
 *   { message: string, errors: Array<{ field: string, message: string }> }
 *
 * On success the validated (and coerced) value is written back to the
 * appropriate request property so that downstream handlers receive clean data.
 *
 * Usage:
 *   import { validate } from '../middleware/validate.js';
 *   import Joi from 'joi';
 *
 *   const schema = Joi.object({ email: Joi.string().email().required() });
 *
 *   router.post('/example', validate(schema), handler);
 *   router.get('/example', validate(schema, 'query'), handler);
 *
 * @param {import('joi').ObjectSchema} schema - The Joi schema to validate against.
 * @param {'body'|'query'|'params'} [source='body'] - Which part of req to validate.
 * @returns {import('express').RequestHandler}
 */
export function validate(schema, source = 'body') {
  return function validationMiddleware(req, res, next) {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(422).json({
        message: 'Validation failed.',
        errors,
      });
    }

    // Replace the request property with the validated/coerced value.
    req[source] = value;

    return next();
  };
}

export default validate;
