import api from './api';

const notificationsService = {
  getNotifications: (params) => api.get('/notifications', { params }),
  markAsRead: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
};

export default notificationsService;
