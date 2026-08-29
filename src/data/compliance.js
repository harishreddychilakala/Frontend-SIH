// ============================================================
// BIS SmartAI — Mock Compliance Data
// DEMO DATA
// ============================================================

export const mockComplianceResult = {
  product: 'Electric Kettle — 1.5L Stainless Steel',
  category: 'Electrical Appliances',
  overallScore: 82,
  status: 'Needs Review',
  standards: ['IS 302-2-15'],
  checkedAt: new Date().toISOString(),
  breakdown: [
    {
      area: 'Safety Requirements',
      score: 90,
      status: 'passed',
      items: [
        { text: 'Automatic thermal cut-out protection', status: 'passed' },
        { text: 'Stable construction and no tip-over', status: 'passed' },
        { text: 'Cord management and protection', status: 'passed' },
        { text: 'No accessible live parts', status: 'passed' },
      ],
    },
    {
      area: 'Testing Documentation',
      score: 75,
      status: 'needs-review',
      items: [
        { text: 'Insulation resistance test report', status: 'passed' },
        { text: 'Dielectric strength test report', status: 'passed' },
        { text: 'Temperature rise test report', status: 'needs-review' },
        { text: 'Leakage current test report', status: 'missing' },
      ],
    },
    {
      area: 'Marking & Documentation',
      score: 85,
      status: 'passed',
      items: [
        { text: 'Rated voltage marked on product', status: 'passed' },
        { text: 'Rated power marked on product', status: 'passed' },
        { text: 'Manufacturer name and address', status: 'passed' },
        { text: 'User instructions in Hindi/English', status: 'needs-review' },
      ],
    },
    {
      area: 'BIS Certification',
      score: 60,
      status: 'needs-review',
      items: [
        { text: 'BIS certification application submitted', status: 'needs-review' },
        { text: 'Factory inspection completed', status: 'missing' },
        { text: 'BIS mark license obtained', status: 'missing' },
        { text: 'QCO compliance verified', status: 'needs-review' },
      ],
    },
  ],
  nextSteps: [
    'Complete leakage current testing at a BIS-recognized laboratory',
    'Submit BIS certification application if not already done',
    'Arrange factory inspection with BIS officer',
    'Verify QCO requirements with BIS for current applicability',
    'Ensure user instructions are provided in Hindi and English',
  ],
};
