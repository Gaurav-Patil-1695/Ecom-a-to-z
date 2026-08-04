import api from './api';

const usersService = {
  // Current user
  getMe: () => api.get('/users/me'),
  updateMe: (data) => api.patch('/users/me', data),
  changePassword: (data) => api.post('/users/me/change-password', data),

  // Admin user CRUD
  adminListUsers: (params) => api.get('/admin/users', { params }),
  adminGetUser: (userId) => api.get(`/admin/users/${userId}`),
  adminCreateUser: (data) => api.post('/admin/users', data),
  adminUpdateUser: (userId, data) => api.patch(`/admin/users/${userId}`, data),
  adminDeleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default usersService;
