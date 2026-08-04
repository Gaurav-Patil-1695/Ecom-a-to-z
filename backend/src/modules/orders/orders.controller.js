import {
  listOrdersService,
  getOrderService,
  getOrderTimelineService,
  getOrderTrackingService,
  getOrderRefundsService,
  cancelOrderService,
  advanceOrderService,
  createReturnRequestService,
} from './orders.service.js';

export async function listOrders(req, res, next) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { page, limit, status, sort } = req.query;
    const result = await listOrdersService({ userId, role, page, limit, status, sort });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const order = await getOrderService({ orderId, userId, role });
    return res.status(200).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrderTimeline(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const timeline = await getOrderTimelineService({ orderId, userId, role });
    return res.status(200).json(timeline);
  } catch (err) {
    next(err);
  }
}

export async function getOrderTracking(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const tracking = await getOrderTrackingService({ orderId, userId, role });
    return res.status(200).json(tracking);
  } catch (err) {
    next(err);
  }
}

export async function getOrderRefunds(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const refunds = await getOrderRefundsService({ orderId, userId, role });
    return res.status(200).json(refunds);
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const { reason } = req.body;
    const result = await cancelOrderService({ orderId, userId, role, reason });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function advanceOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const { status } = req.body;
    const result = await advanceOrderService({ orderId, userId, role, status });
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function createReturnRequest(req, res, next) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;
    const role = req.user?.role;
    const payload = req.body;
    const result = await createReturnRequestService({ orderId, userId, role, payload });
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}
