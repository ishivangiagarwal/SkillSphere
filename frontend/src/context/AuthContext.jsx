import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('skillsphere_token');
      const storedUser = localStorage.getItem('skillsphere_user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await authService.getMe();
          setUser(res.user);
          localStorage.setItem('skillsphere_user', JSON.stringify(res.user));
        } catch {
          localStorage.removeItem('skillsphere_token');
          localStorage.removeItem('skillsphere_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('skillsphere_token', res.token);
    localStorage.setItem('skillsphere_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('skillsphere_token', res.token);
    localStorage.setItem('skillsphere_user', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('skillsphere_token');
    localStorage.removeItem('skillsphere_user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const updateUserInContext = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('skillsphere_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUserInContext, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
