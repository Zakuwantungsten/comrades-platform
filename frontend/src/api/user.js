import api from './apiInstance';

export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await api.patch(`/users/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export default {
  updateUserProfile
};
