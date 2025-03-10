import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    console.log('Login initiated with credentials:', credentials); // Debugging log
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      const userResponse = await api.get('/auth/me');
      setUser(userResponse.data);
      console.log('User logged in successfully:', userResponse.data); // Debugging log
      return userResponse.data;
    } catch (error) {
      console.error('Error during login:', error); // Debugging log
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("Logout initiated."); // Debugging log
      const token = localStorage.getItem('token');
      console.log("Token:", token); // Debugging log
      /*await api.post('/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });*/

      localStorage.removeItem('token');
      setUser(null);
      console.log('User logged out successfully.'); // Debugging log
    } catch (error) {
      console.error('Error during logout:', error); // Debugging log
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
