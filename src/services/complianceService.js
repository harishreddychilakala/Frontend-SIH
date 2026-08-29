// ============================================================
// BIS SmartAI — Compliance Service (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const complianceService = {
  /**
   * Run compliance evaluation
   * POST /api/compliance
   */
  async checkCompliance({ name, category, description, standardReference = null }) {
    const data = await apiClient.post('/api/compliance', {
      product_name: name,
      product_category: category,
      description,
      standard_reference: standardReference,
    });
    return data;
  },

  /**
   * Get past compliance reports
   * GET /api/compliance
   */
  async getComplianceReports() {
    return await apiClient.get('/api/compliance');
  },

  /**
   * Get single report
   * GET /api/compliance/{id}
   */
  async getReport(id) {
    return await apiClient.get(`/api/compliance/${id}`);
  },
};

export default complianceService;
