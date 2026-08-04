import { checkoutService } from './checkout.service.js';

const start = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const guestId = req.user?.guestId ?? null;
    const { cartId } = req.body;

    const result = await checkoutService.startCheckout({ cartId, userId, guestId });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const address = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const guestId = req.user?.guestId ?? null;
    const { checkoutSessionId, addressId, address: addressData } = req.body;

    const result = await checkoutService.saveAddress({
      checkoutSessionId,
      addressId,
      address: addressData,
      userId,
      guestId,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const review = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const guestId = req.user?.guestId ?? null;
    const { checkoutSessionId } = req.query;

    const result = await checkoutService.reviewOrder({
      checkoutSessionId,
      userId,
      guestId,
    });

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const placeOrder = async (req, res, next) => {
  try {
    const userId = req.user?.id ?? null;
    const guestId = req.user?.guestId ?? null;
    const { checkoutSessionId, paymentMethod } = req.body;

    const result = await checkoutService.placeOrder({
      checkoutSessionId,
      paymentMethod,
      userId,
      guestId,
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const checkoutController = {
  start,
  address,
  review,
  placeOrder,
};
