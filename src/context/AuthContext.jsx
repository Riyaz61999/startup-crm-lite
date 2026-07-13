import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('crm-token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await authService.getProfile();
          if (data.success) {
            setUser(data.data);
          } else {
            logout(); // Invalid token
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Token is invalid or expired
          authService.logout();
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        const { token: newToken, user: userData } = data.data;
        localStorage.setItem('crm-token', newToken);
        setToken(newToken);
        setUser(userData);
        toast.success(data.message || 'Logged in successfully');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      const msg = error.response?.data?.message || 'An error occurred during login';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async ({ username, mobileNumber, email, password }) => {
    try {
      const data = await authService.register({ username, mobileNumber, email, password });
      if (data.success) {
        const { token: newToken, user: userData } = data.data;
        localStorage.setItem('crm-token', newToken);
        setToken(newToken);
        setUser(userData);
        toast.success('Registration successful');
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      const msg = error.response?.data?.message || 
                  error.response?.data?.errors?.map(e => e.msg).join(', ') || 
                  'An error occurred during registration';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
