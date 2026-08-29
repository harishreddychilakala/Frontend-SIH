// ============================================================
// BIS SmartAI — Document Service (Connected to FastAPI)
// ============================================================
import apiClient from './apiClient.js';

export const documentService = {
  /**
   * Upload and analyze a document
   * POST /api/documents
   */
  async analyzeDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const doc = await apiClient.post('/api/documents', formData);
    return doc.analysis_result || {
      filename: doc.filename,
      uploadedAt: doc.created_at,
      summary: 'Analysis completed.',
      extractedRequirements: [],
      complianceGaps: [],
      referencedStandards: [],
    };
  },

  /**
   * Get all user documents
   * GET /api/documents
   */
  async getDocuments() {
    return await apiClient.get('/api/documents');
  },

  /**
   * Get single document
   * GET /api/documents/{id}
   */
  async getDocument(id) {
    return await apiClient.get(`/api/documents/${id}`);
  },

  /**
   * Delete document
   * DELETE /api/documents/{id}
   */
  async deleteDocument(id) {
    await apiClient.delete(`/api/documents/${id}`);
    return true;
  },
};

export default documentService;
