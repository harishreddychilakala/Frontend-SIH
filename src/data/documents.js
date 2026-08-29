// ============================================================
// BIS SmartAI — Mock Documents Data
// DEMO DATA
// ============================================================

export const mockDocumentAnalysis = {
  id: 'doc-001',
  filename: 'product-specification.pdf',
  fileSize: '2.4 MB',
  uploadedAt: new Date().toISOString(),
  status: 'analyzed',
  summary: 'This document appears to be a product specification for an electrical heating appliance. It contains technical parameters, material specifications, and some compliance references. Several BIS standard references were identified.',
  extractedRequirements: [
    { text: 'Rated voltage: 220-240V AC, 50Hz', category: 'Electrical', status: 'identified' },
    { text: 'Rated power: 1500W', category: 'Electrical', status: 'identified' },
    { text: 'Thermal cut-out at 100°C ± 5°C', category: 'Safety', status: 'identified' },
    { text: 'Body material: Food-grade stainless steel', category: 'Materials', status: 'identified' },
    { text: 'Insulation Class F', category: 'Electrical', status: 'identified' },
  ],
  importantClauses: [
    'Clause 3.1: Appliance shall be provided with automatic thermal protection',
    'Clause 5.2: Insulation resistance shall not be less than 2 MΩ',
    'Clause 7.1: External surfaces shall not exceed specified temperature limits',
  ],
  complianceGaps: [
    { issue: 'No mention of BIS certification requirement', severity: 'high' },
    { issue: 'Missing leakage current specification', severity: 'medium' },
    { issue: 'User instruction language requirement not specified', severity: 'low' },
  ],
  referencedStandards: [
    { number: 'IS 302-2-15', mentioned: true, status: 'needs-verification' },
    { number: 'IEC 60335-2-15', mentioned: true, status: 'needs-verification' },
  ],
};
