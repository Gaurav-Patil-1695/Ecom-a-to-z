import api from './api';

const cartService = {
  getCart: (cartId) => api.get(`/carts/${cartId}`),
  addItem: (cartId, data) => api.post(`/carts/${cartId}/items`, data),
  updateItem: (cartId, itemId, data) => api.patch(`/carts/${cartId}/items/${itemId}`, data),
  removeItem: (cartId, itemId) => api.delete(`/carts/${cartId}/items/${itemId}`),
  applyPromo: (cartId, data) => api.post(`/carts/${cartId}/promo`, data),
};

export default cartService;
