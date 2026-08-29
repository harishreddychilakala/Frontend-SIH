// ============================================================
// BIS SmartAI — BIS Services Directory (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const serviceCategories = [
  'All Categories',
  'Certification',
  'Registration',
  'Laboratories',
  'Hallmarking',
  'Management Systems',
];

export const servicesService = {
  /**
   * Get all BIS services with optional category filter
   * GET /api/services
   */
  async getServices(category = 'All Categories') {
    const param = category && category !== 'All Categories' ? `?category=${encodeURIComponent(category)}` : '';
    return await apiClient.get(`/api/services${param}`);
  },
};

export default servicesService;
