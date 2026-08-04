import * as returnsService from './returns.service.js';

/**
 * GET /return-requests
 * Admin: list all return requests
 */
export async function listReturnRequests(req, res, next) {
  try {
    const { status, page, limit } = req.query;
    const result = await returnsService.listReturnRequests({ status, page, limit });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /return-requests/:returnRequestId
 * Admin/User: get a single return request by ID
 */
export async function getReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const returnRequest = await returnsService.getReturnRequest(returnRequestId, userId, isAdmin);
    return res.status(200).json(returnRequest);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /return-requests/:returnRequestId/review
 * Admin: approve or reject a return request
 */
export async function reviewReturnRequest(req, res, next) {
  try {
    const { returnRequestId } = req.params;
    const { action, adminNote } = req.body;
    const adminId = req.user.id;
    const result = await returnsService.reviewReturnRequest(returnRequestId, { action, adminNote, adminId });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders/:orderId/return-requests
 * User: initiate a return request for an order
 */
export async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { reason, items, comments } = req.body;
    const returnRequest = await returnsService.createReturnRequest(orderId, userId, { reason, items, comments });
    return res.status(201).json(returnRequest);
  } catch (err) {
    next(err);
  }
}
