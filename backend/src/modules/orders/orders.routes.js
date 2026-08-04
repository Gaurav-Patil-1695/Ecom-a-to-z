import { Router } from 'express';
import {
  listOrders,
  getOrder,
  getOrderTimeline,
  getOrderTracking,
  getOrderRefunds,
  cancelOrder,
  advanceOrder,
  createReturnRequest,
} from './orders.controller.js';

const router = Router();

router.get('/', listOrders);
router.get('/:orderId', getOrder);
router.get('/:orderId/timeline', getOrderTimeline);
router.get('/:orderId/tracking', getOrderTracking);
router.get('/:orderId/refunds', getOrderRefunds);
router.post('/:orderId/cancel', cancelOrder);
router.post('/:orderId/advance', advanceOrder);
router.post('/:orderId/return-requests', createReturnRequest);

export default router;
