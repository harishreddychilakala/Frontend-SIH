/**
 * BIS SmartAI — HTTP API Client
 * Centralized fetch client attaching JWT Bearer token and handling common errors.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const AUTH_KEY = 'bis_smartai_auth';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed?.token || null;
    } catch {
      return null;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers = {
      ...options.headers,
    };

    // Attach Bearer token if present and not already specified
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Set JSON content-type if body is not FormData
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized — auto cleanup expired token
      if (response.status === 401) {
        localStorage.removeItem(AUTH_KEY);
        // Dispatch custom auth state event if needed
        window.dispatchEvent(new Event('auth:unauthorized'));
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage = data?.detail || data?.message || `Request failed with status ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.status) throw err;
      // Network or connectivity error
      const netError = new Error('Cannot connect to BIS SmartAI server. Please check if the backend is running.');
      netError.status = 0;
      throw netError;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
