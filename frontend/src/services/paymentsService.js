import api from './api';

const paymentsService = {
  initiatePayment: (data) => api.post('/payments/initiate', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
};

export default paymentsService;
