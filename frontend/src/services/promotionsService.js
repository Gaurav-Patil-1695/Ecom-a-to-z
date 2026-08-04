import api from './api';

const promotionsService = {
  // Promo code validation
  validatePromoCode: (data) => api.post('/carts/' + data.cartId + '/promo', data),

  // Admin promo code CRUD
  adminListPromoCodes: (params) => api.get('/promo-codes', { params }),
  adminCreatePromoCode: (data) => api.post('/promo-codes', data),
  adminGetPromoCode: (promoCodeId) => api.get(`/promo-codes/${promoCodeId}`),
  adminUpdatePromoCode: (promoCodeId, data) => api.put(`/promo-codes/${promoCodeId}`, data),
  adminDeletePromoCode: (promoCodeId) => api.delete(`/promo-codes/${promoCodeId}`),
};

export default promotionsService;
