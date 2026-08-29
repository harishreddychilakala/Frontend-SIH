// ============================================================
// BIS SmartAI — Auth Service (Connected to FastAPI Backend)
// ============================================================
import apiClient from './apiClient.js';

const AUTH_KEY = 'bis_smartai_auth';

export const authService = {
  /**
   * Login with email and password
   * POST /api/auth/login
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }
    const response = await apiClient.post('/api/auth/login', { email, password });
    const { user, access_token } = response;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: access_token }));
    return { user, token: access_token };
  },

  /**
   * Sign up a new user
   * POST /api/auth/register
   */
  async signup(data) {
    if (!data.email || !data.password || !data.name) {
      throw new Error('Required fields are missing.');
    }
    const response = await apiClient.post('/api/auth/register', data);
    const { user, access_token } = response;
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: access_token }));
    return { user, token: access_token };
  },

  /**
   * Logout the current user
   * POST /api/auth/logout
   */
  async logout() {
    try {
      await apiClient.post('/api/auth/logout', {});
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem(AUTH_KEY);
    }
  },

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  async forgotPassword(email) {
    if (!email) throw new Error('Email is required.');
    return await apiClient.post('/api/auth/forgot-password', { email });
  },

  /**
   * Fetch latest profile from backend
   * GET /api/auth/me
   */
  async fetchCurrentUser() {
    try {
      const user = await apiClient.get('/api/auth/me');
      const stored = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
      localStorage.setItem(AUTH_KEY, JSON.stringify({ ...stored, user }));
      return user;
    } catch {
      return null;
    }
  },

  /**
   * Get cached user from localStorage
   */
  getCurrentUser() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      return JSON.parse(stored).user;
    } catch {
      return null;
    }
  },

  /**
   * Check if authenticated
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Update profile
   * PATCH /api/users/me
   */
  async updateProfile(data) {
    const updatedUser = await apiClient.patch('/api/users/me', data);
    const stored = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ...stored, user: updatedUser }));
    return updatedUser;
  },
};

export default authService;
