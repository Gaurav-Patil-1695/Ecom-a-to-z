import api from './api';

const addressesService = {
  listAddresses: () => api.get('/users/me/addresses'),
  getAddress: (addressId) => api.get(`/users/me/addresses/${addressId}`),
  createAddress: (data) => api.post('/users/me/addresses', data),
  updateAddress: (addressId, data) => api.put(`/users/me/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/users/me/addresses/${addressId}`),
  checkServiceability: (params) => api.get('/serviceability', { params }),
};

export default addressesService;
