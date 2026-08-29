// ============================================================
// BIS SmartAI — Saved Standards Service (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const savedService = {
  /**
   * Get all saved standards for current user
   * GET /api/saved
   */
  async getSavedStandards() {
    return await apiClient.get('/api/saved');
  },

  /**
   * Save a standard to bookmarks
   * POST /api/saved
   */
  async saveStandard(standard) {
    return await apiClient.post('/api/saved', {
      standard_id: standard.id,
      standard_reference: standard.number || standard.standard_reference,
      title: standard.title,
      category: standard.category,
      status: standard.status,
    });
  },

  /**
   * Remove saved standard
   * DELETE /api/saved/{id}
   */
  async deleteSavedStandard(id) {
    await apiClient.delete(`/api/saved/${encodeURIComponent(id)}`);
    return true;
  },
};

export default savedService;
