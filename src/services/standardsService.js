// ============================================================
// BIS SmartAI — Standards Service (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const standardsService = {
  /**
   * Search and filter Indian Standards
   * GET /api/standards
   */
  async searchStandards({ query = '', category = 'All Categories', status = 'All Status', page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (category && category !== 'All Categories') params.append('category', category);
    if (status && status !== 'All Status') params.append('status', status);
    params.append('page', page);
    params.append('limit', limit);

    const data = await apiClient.get(`/api/standards?${params.toString()}`);
    return {
      total: data.total,
      results: data.results.map(formatStandard),
      page: data.page,
      limit: data.limit,
    };
  },

  /**
   * Get single standard details
   * GET /api/standards/{id}
   */
  async getStandard(id) {
    const std = await apiClient.get(`/api/standards/${encodeURIComponent(id)}`);
    return formatStandard(std);
  },

  /**
   * Compare two Indian Standards using Gemini AI
   * POST /api/standards/compare
   */
  async compareStandards(stdAId, stdBId) {
    return await apiClient.post('/api/standards/compare', {
      standard_a_id: stdAId,
      standard_b_id: stdBId,
    });
  },

  /**
   * Explain an Indian Standard with AI deep-dive
   * POST /api/standards/{id}/explain
   */
  async explainStandard(id) {
    return await apiClient.post(`/api/standards/${encodeURIComponent(id)}/explain`, {});
  },
};

function formatStandard(s) {
  return {
    id: s.id,
    number: s.number,
    title: s.title,
    category: s.category,
    subcategory: s.subcategory,
    status: s.status,
    lastUpdated: s.last_updated || s.lastUpdated || '2023-01-01',
    qcoApplicable: s.qco_applicable ?? s.qcoApplicable ?? false,
    bisMarkRequired: s.bis_mark_required ?? s.bisMarkRequired ?? false,
    scope: s.scope,
    overview: s.overview,
    requirements: s.requirements,
    testing: s.testing,
    certification: s.certification,
    sources: s.sources,
  };
}

export default standardsService;
