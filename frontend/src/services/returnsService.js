import api from './api';

const returnsService = {
  // Customer returns endpoints
  createReturnRequest: (orderId, data) => api.post(`/orders/${orderId}/return-requests`, data),
  getReturnRequest: (returnRequestId) => api.get(`/return-requests/${returnRequestId}`),

  // Admin returns endpoints
  adminListReturnRequests: (params) => api.get('/return-requests', { params }),
  adminGetReturnRequest: (returnRequestId) => api.get(`/return-requests/${returnRequestId}`),
  adminReviewReturnRequest: (returnRequestId, data) => api.post(`/return-requests/${returnRequestId}/review`, data),
};

export default returnsService;
