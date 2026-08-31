import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStorage } from '../services/storage/tokenStorage';
import authService from '../features/auth/services/auth.service';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [accessToken, setAccessToken] = useState(() => tokenStorage.getAccessToken());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize state from storage on mount
  useEffect(() => {
    const storedUser = tokenStorage.getUser();
    const storedToken = tokenStorage.getAccessToken();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setAccessToken(storedToken);
    }
  }, []);

  const login = useCallback(async ({ account, email, password }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login({ account, email, password });
      setUser(data.user);
      setAccessToken(data.accessToken);
      return data;
    } catch (err) {
      const errMsg = err.friendlyMessage || err.response?.data?.message || err.message || 'Đăng nhập thất bại';
      setError(errMsg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setAccessToken(null);
    setError(null);
  }, []);

  const value = {
    user,
    role: user?.role ? String(user.role).toUpperCase() : null,
    accessToken,
    isAuthenticated: !!accessToken && !!user,
    isLoading,
    error,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
