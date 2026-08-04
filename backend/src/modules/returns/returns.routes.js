import { Router } from 'express';
import {
  listReturnRequests,
  getReturnRequest,
  reviewReturnRequest,
  createReturnRequest,
} from './returns.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  reviewReturnRequestSchema,
  createReturnRequestSchema,
} from './returns.validator.js';

const router = Router();

// Admin: list all return requests
// GET /return-requests
router.get(
  '/return-requests',
  requireAuth,
  requireAdmin,
  listReturnRequests
);

// Admin/User: get a single return request by ID
// GET /return-requests/:returnRequestId
router.get(
  '/return-requests/:returnRequestId',
  requireAuth,
  getReturnRequest
);

// Admin: review (approve/reject) a return request
// POST /return-requests/:returnRequestId/review
router.post(
  '/return-requests/:returnRequestId/review',
  requireAuth,
  requireAdmin,
  validate(reviewReturnRequestSchema),
  reviewReturnRequest
);

// User: create a return request for an order
// POST /orders/:orderId/return-requests
router.post(
  '/orders/:orderId/return-requests',
  requireAuth,
  validate(createReturnRequestSchema),
  createReturnRequest
);

export default router;
