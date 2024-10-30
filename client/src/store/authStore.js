import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/client';
axios.defaults.withCredentials = true;

const useAuthStore = create((set) => ({
  client: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  isLogout: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ client: response.data.client, isLoading: false, isLogout: null });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error signing up', isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({
        isAuthenticated: true,
        client: response.data.client,
        error: null,
        isLoading: false,
        isLogout: null,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error logging in', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, isLogout: true });

    try {
      await axios.post(`${API_URL}/logout`);
      set({ client: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error logging out', isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ client: response.data.client, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error verifying email', isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ client: response.data.client, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error checking authentication',
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });

    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error sending reset password email',
      });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Error resetting password',
      });
      throw error;
    }
  },
}));

export default useAuthStore;