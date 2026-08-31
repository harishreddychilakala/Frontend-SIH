// ============================================================
// BIS SmartAI — Mock Activities Data
// DEMO DATA
// ============================================================

export const mockActivities = [
  {
    id: 'act-001',
    type: 'ai-query',
    title: 'Electric Kettle Requirements',
    description: 'Explored IS 302-2-15 requirements via AI assistant',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    icon: 'message-square',
    link: '/assistant',
  },
  {
    id: 'act-002',
    type: 'standard-view',
    title: 'IS 2062 Structural Steel',
    description: 'Viewed standard details and testing requirements',
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    icon: 'file-text',
    link: '/standards/IS-2062',
  },
  {
    id: 'act-003',
    type: 'compliance-check',
    title: 'Compliance Check Completed',
    description: 'Pressure cooker compliance assessment — 82% readiness',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    icon: 'shield-check',
    link: '/compliance',
  },
  {
    id: 'act-004',
    type: 'document',
    title: 'Document Analyzed',
    description: 'Uploaded and analyzed product specification document',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    icon: 'upload',
    link: '/documents',
  },
  {
    id: 'act-005',
    type: 'standard-view',
    title: 'IS 1890 Portland Cement',
    description: 'Explored IS 1890 specification and requirements',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    icon: 'file-text',
    link: '/standards/IS-1890',
  },
  {
    id: 'act-006',
    type: 'ai-query',
    title: 'Toy Safety Standards',
    description: 'Researched IS 17240 requirements for plastic toys',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    icon: 'message-square',
    link: '/assistant',
  },
];

export const mockDashboardStats = {
  standardsExplored: 47,
  savedStandards: 12,
  complianceChecks: 8,
  aiConversations: 23,
  lastUpdated: new Date().toISOString(),
};
