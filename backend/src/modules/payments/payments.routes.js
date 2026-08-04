import { Router } from 'express';
import {
  initiatePayment,
  confirmPayment,
  paymentWebhook,
} from './payments.controller.js';

const router = Router();

router.post('/initiate', initiatePayment);
router.post('/confirm', confirmPayment);
router.post('/webhook', paymentWebhook);

export default router;
