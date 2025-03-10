import api from './index';

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createNotification = async (notificationData) => {
  // Add any additional logic here if needed

  try {
    const response = await api.post('/notifications', notificationData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
