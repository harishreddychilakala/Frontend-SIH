// ============================================================
// BIS SmartAI — Laboratory Service (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const labStates = [
  'All States',
  'Uttar Pradesh',
  'Maharashtra',
  'Tamil Nadu',
  'West Bengal',
  'Punjab',
  'Delhi',
  'Karnataka',
];

export const labTestingTypes = [
  'All Types',
  'Electrical',
  'Mechanical',
  'Chemical',
  'Electronics',
  'Civil',
  'Food & Beverages',
];

export const laboratoryService = {
  /**
   * Search and filter laboratories
   * GET /api/laboratories
   */
  async searchLaboratories({ query = '', state = 'All States', testingType = 'All Types' } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (state && state !== 'All States') params.append('state', state);
    if (testingType && testingType !== 'All Types') params.append('testing_type', testingType);

    const data = await apiClient.get(`/api/laboratories?${params.toString()}`);
    return data || [];
  },
};

export default laboratoryService;
