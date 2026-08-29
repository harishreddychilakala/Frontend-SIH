// ============================================================
// BIS SmartAI — Chat Service (Connected to FastAPI + Gemini)
// ============================================================
import apiClient from './apiClient.js';

export const chatService = {
  /**
   * Get all conversations for current user
   * GET /api/conversations
   */
  async getConversations(search = '') {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const conversations = await apiClient.get(`/api/conversations${query}`);
    return conversations.map(c => ({
      id: c.id,
      title: c.title,
      preview: c.last_message || 'Start conversation...',
      timestamp: c.updated_at || c.created_at,
      category: categorizeDate(c.updated_at || c.created_at),
    }));
  },

  /**
   * Get conversation details with message history
   * GET /api/conversations/{id}
   */
  async getConversation(id) {
    const conv = await apiClient.get(`/api/conversations/${id}`);
    return {
      ...conv,
      messages: (conv.messages || []).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        structured: !!m.structured_response,
        answer: m.structured_response || null,
        timestamp: m.created_at,
      })),
    };
  },

  /**
   * Start new conversation with first prompt
   * POST /api/chat
   */
  async createConversation(prompt, title = null) {
    const conv = await apiClient.post('/api/chat', { content: prompt, title });
    return {
      id: conv.id,
      title: conv.title,
      preview: conv.messages?.[0]?.content || prompt,
      timestamp: conv.created_at,
      category: 'today',
      messages: (conv.messages || []).map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        structured: !!m.structured_response,
        answer: m.structured_response || null,
        timestamp: m.created_at,
      })),
    };
  },

  /**
   * Send message in existing conversation
   * POST /api/chat/{conversation_id}/messages
   */
  async sendMessage(conversationId, content) {
    const message = await apiClient.post(`/api/chat/${conversationId}/messages`, { content });
    return {
      id: message.id,
      role: message.role,
      content: message.content,
      structured: !!message.structured_response,
      answer: message.structured_response || null,
      timestamp: message.created_at,
    };
  },

  /**
   * Delete conversation
   * DELETE /api/conversations/{id}
   */
  async deleteConversation(id) {
    await apiClient.delete(`/api/conversations/${id}`);
    return true;
  },
};

function categorizeDate(ts) {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays <= 7) return 'week';
  return 'older';
}

export default chatService;
