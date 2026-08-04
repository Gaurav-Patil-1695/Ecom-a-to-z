import api from './api';

const ordersService = {
  // Customer order endpoints
  listOrders: (params) => api.get('/orders', { params }),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getOrderTimeline: (orderId) => api.get(`/orders/${orderId}/timeline`),
  getOrderTracking: (orderId) => api.get(`/orders/${orderId}/tracking`),
  getOrderRefunds: (orderId) => api.get(`/orders/${orderId}/refunds`),
  cancelOrder: (orderId, data) => api.post(`/orders/${orderId}/cancel`, data),
  createReturnRequest: (orderId, data) => api.post(`/orders/${orderId}/return-requests`, data),

  // Admin order endpoints
  adminListOrders: (params) => api.get('/orders', { params }),
  adminGetOrder: (orderId) => api.get(`/orders/${orderId}`),
  adminAdvanceOrder: (orderId, data) => api.post(`/orders/${orderId}/advance`, data),
};

export default ordersService;
