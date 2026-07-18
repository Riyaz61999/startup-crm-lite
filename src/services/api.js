import axios from 'axios';
import toast from 'react-hot-toast';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Request interceptor that automatically adds the Authorization header
api.interceptors.request.use(
  (config) => {
    // Fail fast if trying to hit localhost from a deployed site
    const baseURL = config.baseURL || '';
    if (window.location.hostname !== 'localhost' && baseURL.includes('localhost')) {
      return Promise.reject(new Error('Backend is not configured. Please set VITE_API_URL in Vercel to your deployed backend URL.'));
    }

    const token = localStorage.getItem('crm-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error
      // Check if we are trying to hit localhost from a deployed site
      if (
        window.location.hostname !== 'localhost' &&
        error.config.url.includes('localhost')
      ) {
        toast.error(
          'Backend is not configured! Please set VITE_API_URL in Vercel to your deployed backend URL.',
          { duration: 10000 }
        );
      } else {
        toast.error('Cannot connect to server. Check your connection.');
      }
    } else if (error.response.status === 401) {
      // Unauthorized: clear token and redirect to login
      localStorage.removeItem('crm-token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
