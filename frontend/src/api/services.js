import api from './apiInstance';
import { io } from 'socket.io-client';

// Initialize Socket.IO
const socket = io('http://localhost:5000'); // Replace with your backend URL

// Fetch all services
export const getAllServices = async () => {
  try {
    const response = await api.get('/services/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
};

// Fetch messages for a user
export const getMessages = async (userId) => {
  try {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const sendMessage = async ({ receiver, content }) => {
  try {
    const response = await api.post('/api/messages', { receiver, content });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};
// Fetch a specific service by ID
export const getServiceById = async (serviceId) => {
  try {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData) => {
  try {
    const response = await api.post('/services', serviceData);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update an existing service
export const updateService = async (serviceId, serviceData) => {
  try {
    const response = await api.patch(`/services/${serviceId}`, serviceData);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (serviceId) => {
  try {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};

// Create a service request
export const createServiceRequest = async (requestData) => {
  try {
    const response = await api.post('/service-requests', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
};

// Get services by user
export const getServicesByUser = async (userId) => {
  try {
    const response = await api.get(`/services/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching services by user:', error);
    throw error;
  }
};

// Get service requests for the current user
export const getServiceRequestsByUser = async () => {
  try {
    const response = await api.get('/service-requests/my-requests');
    return response.data;
  } catch (error) {
    console.error('Error fetching service requests:', error);
    throw error;
  }
};