// ============================================================
// BIS SmartAI — Auth Service (Connected to FastAPI Backend)
// Enforces JWT expiration validation and session lifecycle.
// ============================================================
import apiClient from './apiClient.js';

const AUTH_KEY = 'bis_smartai_auth';

/**
 * Safely parse a JWT payload without external dependencies.
 */
export function parseJwt(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Check whether a JWT token is expired.
 */
export function isTokenExpired(token) {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowInSeconds;
}

export const authService = {
  /**
   * Get valid auth data from localStorage. Automatically cleans up if expired.
   */
  getAuthData() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (!parsed?.token || isTokenExpired(parsed.token)) {
        localStorage.removeItem(AUTH_KEY);
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  },

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
      const stored = this.getAuthData() || {};
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ ...stored, user }));
      }
      return user;
    } catch {
      return null;
    }
  },

  /**
   * Get cached user from localStorage (validates token expiration)
   */
  getCurrentUser() {
    const authData = this.getAuthData();
    return authData?.user || null;
  },

  /**
   * Get raw JWT token
   */
  getToken() {
    const authData = this.getAuthData();
    return authData?.token || null;
  },

  /**
   * Check if user is currently authenticated with a valid unexpired token
   */
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  /**
   * Get remaining seconds before current JWT access token expires
   */
  getTokenRemainingSeconds() {
    const token = this.getToken();
    if (!token) return 0;
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return 0;
    const remaining = decoded.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, remaining);
  },

  /**
   * Update profile
   * PATCH /api/users/me
   */
  async updateProfile(data) {
    const updatedUser = await apiClient.patch('/api/users/me', data);
    const stored = this.getAuthData() || {};
    localStorage.setItem(AUTH_KEY, JSON.stringify({ ...stored, user: updatedUser }));
    return updatedUser;
  },
};

export default authService;
