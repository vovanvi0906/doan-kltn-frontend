import apiClient from '../../../services/api/client';
import { tokenStorage } from '../../../services/storage/tokenStorage';

export const authService = {
  /**
   * Log in user with email/phone and password
   * @param {{ account?: string, email?: string, password: string }} credentials 
   * @returns {Promise<{ accessToken: string, user: { role: string, [key: string]: any } }>}
   */
  login: async ({ account, email, password }) => {
    const identifier = (account || email || '').trim();
    const response = await apiClient.post('/auth/login', {
      email: identifier,
      account: identifier,
      password,
    });
    
    // API returns { accessToken, user: { role, ... } }
    const data = response.data;
    if (data.accessToken) {
      tokenStorage.setAccessToken(data.accessToken);
    }
    if (data.user) {
      tokenStorage.setUser(data.user);
    }
    return data;
  },

  /**
   * Log out user and purge local tokens
   */
  logout: () => {
    tokenStorage.clearAuth();
  },

  /**
   * Get current authenticated user from storage
   */
  getCurrentUser: () => {
    return tokenStorage.getUser();
  },

  /**
   * Get current access token
   */
  getAccessToken: () => {
    return tokenStorage.getAccessToken();
  },

  /**
   * Check if current session is authenticated
   */
  isAuthenticated: () => {
    return !!tokenStorage.getAccessToken();
  },
};

export default authService;
