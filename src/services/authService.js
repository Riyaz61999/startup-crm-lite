import api from './api';

const authService = {
  // Register a new user
  register: async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },
  
  // Login a user
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
  
  // Logout a user (stateless, removes token)
  logout: () => {
    localStorage.removeItem('crm-token');
  },
  
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  }
};

export default authService;
