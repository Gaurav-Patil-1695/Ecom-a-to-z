import api from './api';

const checkoutService = {
  initiateCheckout: (data) => api.post('/checkout/initiate', data),
  confirmCheckout: (data) => api.post('/checkout/confirm', data),
  reviewCheckout: () => api.get('/checkout/review'),
  setCheckoutAddress: (data) => api.post('/checkout/address', data),
  placeOrder: (data) => api.post('/checkout/place-order', data),
};

export default checkoutService;
