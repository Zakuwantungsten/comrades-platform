import api from './apiInstance';

// Export all API functions
export * from './admin';
export * from './notifications';
export * from './services';
export * from './user';

// Export the default API instance
export default api;

export * from './user';

// User profile functions
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.patch(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
