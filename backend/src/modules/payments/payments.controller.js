import * as paymentsService from './payments.service.js';

export async function initiatePayment(req, res, next) {
  try {
    const result = await paymentsService.initiatePayment(req.body, req.user);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function confirmPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.confirmPayment(paymentId, req.body, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function paymentWebhook(req, res, next) {
  try {
    const result = await paymentsService.handleCallback(req.body, req.headers);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.getPayment(paymentId, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function retryPayment(req, res, next) {
  try {
    const { paymentId } = req.params;
    const result = await paymentsService.retryPayment(paymentId, req.body, req.user);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
