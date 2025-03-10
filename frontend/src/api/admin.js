import api from './apiInstance';


export const getAdminDashboard = async () => {
  try {
    const response = await api.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    throw error;
  }
};

export const getAdminServices = async () => {
  try {
    const response = await api.get('/admin/services');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin services:', error);
    throw error;
  }
};

export const getAdminServiceRequests = async () => {
  try {
    const response = await api.get('/admin/requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin service requests:', error);
    throw error;
  }
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

export const updateServiceStatus = async (serviceId, status) => {
  try {
    const response = await api.patch(`/admin/services/${serviceId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
};

export const updateUserAdminStatus = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/${userId}/admin-status`);
    return response.data;
  } catch (error) {
    console.error('Error updating user admin status:', error);
    throw error;
  }
};
