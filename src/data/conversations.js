// ============================================================
// BIS SmartAI — Mock Conversations Data
// DEMO DATA
// ============================================================

export const mockConversations = [
  {
    id: 'conv-001',
    title: 'Electric Kettle Requirements',
    preview: 'Which BIS standard applies to electric kettles and what are the QCO requirements?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
    category: 'today',
    messageCount: 6,
    pinned: false,
  },
  {
    id: 'conv-002',
    title: 'Cement Certification Process',
    preview: 'What is the BIS certification process for Portland cement under IS 1890?',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    category: 'today',
    messageCount: 8,
    pinned: false,
  },
  {
    id: 'conv-003',
    title: 'Steel QCO Requirements',
    preview: 'Is IS 2062 structural steel under mandatory QCO? What testing is required?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // yesterday
    category: 'yesterday',
    messageCount: 5,
    pinned: false,
  },
  {
    id: 'conv-004',
    title: 'Toy Safety Standards',
    preview: 'What Indian standards apply to plastic toys for children? IS 17240 scope?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // yesterday
    category: 'yesterday',
    messageCount: 10,
    pinned: false,
  },
  {
    id: 'conv-005',
    title: 'LED Driver Testing Requirements',
    preview: 'Testing labs for LED drivers in India — IS standards and accredited laboratories',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    category: 'week',
    messageCount: 7,
    pinned: false,
  },
  {
    id: 'conv-006',
    title: 'BIS Mark vs ISI Mark',
    preview: 'Difference between BIS certification mark and ISI mark — which products need which?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    category: 'week',
    messageCount: 4,
    pinned: false,
  },
  {
    id: 'conv-007',
    title: 'Pressure Cooker Safety Requirements',
    preview: 'IS standards for stainless steel pressure cookers and mandatory BIS certification',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    category: 'older',
    messageCount: 9,
    pinned: false,
  },
];

export const mockMessages = {
  'conv-001': [
    {
      id: 'msg-001-1',
      role: 'user',
      content: 'Which BIS standard applies to electric kettles and what are the QCO requirements?',
      timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 'msg-001-2',
      role: 'assistant',
      content: null,
      structured: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
      answer: {
        summary: 'Electric kettles (appliances for heating liquids) are primarily covered under IS 302 Part 2 Section 15 in India. This standard deals with safety requirements for household appliances that heat liquids. Based on available information, mandatory BIS certification may be required — please verify with official BIS sources for current requirements.',
        standard: {
          number: 'IS 302-2-15',
          title: 'Safety of Household Electrical Appliances — Particular Requirements for Appliances for Heating Liquids',
          status: 'Active',
          verification: 'needs-verification',
        },
        requirements: [
          { text: 'Automatic thermal cut-out protection required', status: 'check' },
          { text: 'Insulation resistance ≥ 2 MΩ required', status: 'check' },
          { text: 'Dielectric strength test at 1250V AC', status: 'check' },
          { text: 'Leakage current within specified limits', status: 'check' },
          { text: 'BIS mark mandatory — verify current QCO status', status: 'warning' },
          { text: 'Factory inspection by BIS officer required', status: 'warning' },
        ],
        qco: 'QCO applicability needs to be verified with the latest notifications from DPIIT and BIS. Check BIS official website for current QCO status for electrical appliances.',
        testing: 'Testing must be conducted at BIS-recognized laboratories. Key tests include electrical safety, insulation resistance, dielectric strength, temperature rise, and stability tests. Duration is typically 4–8 weeks.',
        certification: 'BIS Certification Scheme I (Product Certification) applies. Process involves application submission, factory inspection, sample testing, and license grant. Annual surveillance testing required.',
        sources: [
          { title: 'IS 302-2-15 Standard', type: 'Standard Document', domain: 'bis.gov.in', verified: false },
          { title: 'BIS Product Certification Scheme', type: 'Government Source', domain: 'bis.gov.in', verified: false },
        ],
      },
    },
    {
      id: 'msg-001-3',
      role: 'user',
      content: 'What testing laboratories in India are recognized for this standard?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
      id: 'msg-001-4',
      role: 'assistant',
      content: 'BIS-recognized laboratories for electrical appliance testing are listed on the BIS official website. For IS 302-2-15, you would need a laboratory accredited by NABL for electrical safety testing. The specific list of recognized labs changes periodically — always verify with BIS directly. [This is demo data — actual laboratory recommendations require verification with BIS.]',
      structured: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
    },
  ],
};
