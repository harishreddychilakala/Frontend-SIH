import { useState, useEffect } from 'react';
import {
  CheckCircle, AlertTriangle, XCircle, Shield, FileText, Sparkles,
  ArrowRight, RotateCcw, Download, ExternalLink, HelpCircle, Building2, Globe,
  Package, Tag, Layers, BookOpen, Sliders, Check, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import complianceService from '../services/complianceService.js';
import { useApp } from '../context/AppContext.jsx';
import './Compliance.css';

const SAMPLE_PRESETS = [
  {
    name: 'Electric Storage Water Heater',
    category: 'Electrical Appliances',
    standard: 'IS 2082 / IS 302-2-15',
    type: 'Domestic Manufacturer',
    market: 'Indian Domestic Market',
    desc: 'Stationary electric storage water heater 15L-25L capacity with automatic thermostat, safety valve, and 8 bar pressure rating.',
    tag: 'IS 2082',
  },
  {
    name: 'High Strength TMT Rebar (Fe 500D)',
    category: 'Iron and Steel',
    standard: 'IS 1786',
    type: 'Domestic Manufacturer',
    market: 'Commercial Infrastructure',
    desc: 'Thermo-mechanically treated deformed steel bars for seismic-resistant concrete reinforcement under mandatory Ministry of Steel QCO.',
    tag: 'IS 1786',
  },
  {
    name: 'Two-Wheeler Protective Helmet',
    category: 'Automotive & Safety',
    standard: 'IS 4151',
    type: 'Domestic Manufacturer',
    market: 'Indian Domestic Market',
    desc: 'Full-face protective helmet for motorcycle riders with polycarbonate scratch-resistant visor and chin strap retention system <= 1.2kg.',
    tag: 'IS 4151',
  },
  {
    name: '5G Smartphone / Power Adapter',
    category: 'Electronics & IT',
    standard: 'IS 13252 (Part 1) / IS 16046',
    type: 'Importer / Brand Owner',
    market: 'Indian Domestic Market',
    desc: 'Cellular mobile phone with built-in lithium-ion battery and 33W fast USB power adapter complying with MeitY CRS Scheme II.',
    tag: 'IS 13252',
  },
];

const categories = [
  'Electrical Appliances',
  'Construction Materials',
  'Iron and Steel',
  'Electronics & IT',
  'Automotive & Safety',
  'Toys & Children Goods',
  'Chemicals & Petrochemicals',
  'Food Products',
  'Other',
];

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('check'); // 'check' | 'history'
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electrical Appliances');
  const [standardRef, setStandardRef] = useState('');
  const [manufacturerType, setManufacturerType] = useState('Domestic Manufacturer');
  const [intendedMarket, setIntendedMarket] = useState('Indian Domestic Market');
  const [description, setDescription] = useState('');
  const [activePresetIndex, setActivePresetIndex] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [historyReports, setHistoryReports] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const { addToast } = useApp();
  const navigate = useNavigate();

  // Load past history reports
  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await complianceService.getComplianceReports();
      setHistoryReports(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const handleApplyPreset = (preset, index) => {
    setActivePresetIndex(index);
    setProductName(preset.name);
    setCategory(preset.category);
    setStandardRef(preset.standard);
    setManufacturerType(preset.type);
    setIntendedMarket(preset.market);
    setDescription(preset.desc);
    addToast(`Filled details for ${preset.name}`, 'info');
  };

  const handleRunCheck = async (e) => {
    if (e) e.preventDefault();
    if (!productName.trim()) {
      addToast('Please enter a product name', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await complianceService.checkCompliance({
        name: productName,
        category,
        standardReference: standardRef || null,
        description,
      });
      setResult(res);
      addToast('Compliance evaluation completed and saved to database', 'success');
    } catch (err) {
      addToast('Compliance check failed. Please check your connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setProductName('');
    setStandardRef('');
    setDescription('');
    setActivePresetIndex(null);
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s.includes('COMPLIANT') && !s.includes('NON') && !s.includes('PARTIAL')) {
      return <span className="badge badge-success"><CheckCircle size={12} /> Compliant</span>;
    }
    if (s.includes('PARTIAL')) {
      return <span className="badge badge-warning"><AlertTriangle size={12} /> Partially Compliant</span>;
    }
    if (s.includes('NON')) {
      return <span className="badge badge-error"><XCircle size={12} /> Non-Compliant</span>;
    }
    return <span className="badge badge-blue"><Shield size={12} /> Needs Verification</span>;
  };

  return (
    <div className="compliance animate-fade-in">
      {/* Background Ambient Glowing Orbs for Frosted Glass Effect */}
      <div className="compliance__glow-mesh" aria-hidden="true">
        <div className="compliance__glow compliance__glow--1" />
        <div className="compliance__glow compliance__glow--2" />
        <div className="compliance__glow compliance__glow--3" />
      </div>

      {/* ── Page Header ── */}
      <div className="compliance__header">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="badge badge-blue text-xs">
                <Sparkles size={11} className="text-blue" /> BIS-AI Compliance Engine
              </span>
              <span className="badge badge-muted text-xs">Statutory QCO Radar</span>
            </div>
            <h1 className="page-title">Compliance Checker</h1>
            <p className="page-subtitle">
              Instant AI evaluation of product conformity against Indian Standards (IS), statutory Quality Control Orders (QCO), mandatory test clauses, and BIS certification schemes.
            </p>
          </div>

          <div className="compliance__nav-tabs">
            <button
              className={`compliance__tab-btn ${activeTab === 'check' ? 'compliance__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('check')}
            >
              <Sparkles size={14} />
              <span>New Assessment</span>
            </button>
            <button
              className={`compliance__tab-btn ${activeTab === 'history' ? 'compliance__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <FileText size={14} />
              <span>Past Reports ({historyReports.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'history' ? (
        /* History View */
        <div className="animate-fade-in">
          <div className="compliance__glass-card">
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: '16px', color: 'var(--text-primary)' }}>
              Past Compliance Evaluations
            </h2>
            {loadingHistory ? (
              <p className="text-secondary text-sm">Loading historical reports from database...</p>
            ) : historyReports.length === 0 ? (
              <div className="empty-state" style={{ padding: '36px 16px', textAlign: 'center' }}>
                <Shield className="empty-state-icon" style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} size={32} />
                <p className="empty-state-title" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No compliance checks found</p>
                <p className="empty-state-description" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                  Run your first product assessment using the New Assessment tab.
                </p>
                <button className="btn btn-primary btn-sm" onClick={() => setActiveTab('check')} style={{ marginTop: '14px' }}>
                  Start Compliance Check
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {historyReports.map((item) => (
                  <div
                    key={item.id}
                    className="compliance__history-item"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-primary">{item.product_name}</span>
                        {getStatusBadge(item.status)}
                        {item.standard_reference && (
                          <span className="standards__std-number text-xs">{item.standard_reference}</span>
                        )}
                      </div>
                      <div className="text-xs text-muted">
                        Category: {item.product_category || 'General'} • Score: <span className="text-blue font-semibold">{item.overall_score}%</span> • Date: {new Date(item.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setResult(item.result_json || {
                          product: item.product_name,
                          category: item.product_category,
                          standard: item.standard_reference,
                          overall_score: item.overall_score,
                          status: item.status,
                          breakdown: [],
                          next_steps: []
                        });
                        setActiveTab('check');
                      }}
                    >
                      View Report
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : result ? (
        /* Evaluation Results View */
        <div className="compliance__results animate-fade-in">
          {/* Executive Header Banner */}
          <div className="compliance__glass-card compliance__hero-glass-card">
            <div className="compliance__hero-top">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {getStatusBadge(result.status)}
                  <div className="verified-badge">
                    <Shield size={10} /> {result.verification_status === 'verified' ? 'Verified Regulatory Rules' : 'Official BIS Verification'}
                  </div>
                </div>
                <h2 className="compliance__hero-title">{result.product}</h2>
                <p className="text-secondary text-sm">
                  Applicable Standard: <strong style={{ color: 'var(--blue-light)' }}>{result.standard || 'IS Specification'}</strong>
                  {result.standard_title && ` — ${result.standard_title}`}
                </p>
              </div>

              <div className="compliance__score-circle">
                <div className="compliance__score-val">{result.overall_score}%</div>
                <div className="compliance__score-lbl">Compliance Score</div>
              </div>
            </div>

            {/* QCO Mandate Alert */}
            {result.qco_details && (
              <div className="compliance__qco-banner">
                <AlertTriangle size={16} className="text-warning flex-shrink-0" />
                <div className="text-xs text-secondary" style={{ lineHeight: '1.5' }}>
                  <strong className="text-primary">Statutory QCO Status: </strong>
                  {result.qco_details}
                </div>
              </div>
            )}
          </div>

          {/* Detailed Breakdown Grid */}
          <div className="compliance__grid">
            {/* Audit Areas */}
            <div className="compliance__glass-card">
              <h3 className="section-title mb-3 flex items-center gap-2">
                <Layers size={16} className="text-blue" /> Audit Area Evaluation
              </h3>
              <div className="compliance__breakdown-list">
                {result.breakdown?.map((b, idx) => (
                  <div key={idx} className="compliance__breakdown-item">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-semibold text-sm text-primary">{b.area}</span>
                      <span className="text-xs font-bold text-blue-light">{b.score}%</span>
                    </div>
                    <div className="progress-bar-wrap mb-2">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${b.score}%`,
                          background: b.score >= 90 ? 'var(--success)' : b.score >= 70 ? 'var(--blue)' : 'var(--warning)'
                        }}
                      />
                    </div>
                    {b.items?.map((it, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-secondary mt-1">
                        {it.status === 'passed' ? (
                          <CheckCircle size={13} className="text-success flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={13} className="text-warning flex-shrink-0 mt-0.5" />
                        )}
                        <span>{it.text}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Mandatory Testing Clauses */}
            <div className="compliance__glass-card">
              <h3 className="section-title mb-3 flex items-center gap-2">
                <Sliders size={16} className="text-blue" /> Mandatory Laboratory Tests
              </h3>
              <div className="flex flex-col gap-2">
                {result.testing_clauses?.length > 0 ? (
                  result.testing_clauses.map((t, idx) => (
                    <div key={idx} className="compliance__test-pill">
                      <span className="compliance__pill-num">{idx + 1}</span>
                      <span className="text-xs text-primary font-medium">{t}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted">Type tests conforming to applicable IS specification.</p>
                )}
              </div>

              <h3 className="section-title mb-2 mt-4 flex items-center gap-2">
                <FileText size={15} className="text-indigo" /> Required Documents Checklist
              </h3>
              <div className="flex flex-col gap-1.5">
                {result.required_documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-secondary">
                    <FileText size={12} className="text-blue flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actionable Next Steps */}
          <div className="compliance__glass-card" style={{ marginTop: '20px' }}>
            <h3 className="section-title mb-2">Recommended Next Steps for Certification</h3>
            <ol className="compliance__steps-list mb-4">
              {result.next_steps?.map((step, idx) => (
                <li key={idx} className="text-sm text-secondary mb-1.5">
                  {step}
                </li>
              ))}
            </ol>

            <div className="flex gap-3 flex-wrap">
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Give me full step-by-step BIS certification guidance for ${result.product} (${result.standard})`)}`)}
              >
                <Sparkles size={14} /> Ask BIS-AI for Clause Guidance
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate('/laboratories')}
              >
                Find Testing Laboratories
              </button>
              <button
                className="btn btn-ghost"
                onClick={resetForm}
              >
                <RotateCcw size={14} /> New Assessment
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── New Assessment Frosted Glass Form View ── */
        <div className="compliance__form-wrap animate-fade-in">
          {/* Quick Presets Glass Bar */}
          <div className="compliance__glass-card compliance__presets-bar">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles size={14} className="text-blue" />
              <span className="compliance__presets-title">Quick Sample Presets (Click to Auto-Fill)</span>
            </div>
            <div className="compliance__presets-list">
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  key={p.name}
                  type="button"
                  className={`compliance__preset-chip ${activePresetIndex === idx ? 'compliance__preset-chip--active' : ''}`}
                  onClick={() => handleApplyPreset(p, idx)}
                >
                  <span className="compliance__preset-tag">{p.tag}</span>
                  <span className="compliance__preset-name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frosted Glass Form */}
          <form onSubmit={handleRunCheck} className="compliance__glass-card compliance__main-form">
            <div className="compliance__form-header">
              <div className="compliance__form-icon-wrap">
                <Shield size={22} className="text-blue" />
              </div>
              <div>
                <h2 className="compliance__form-title">Product Compliance Details</h2>
                <p className="compliance__form-desc">
                  Enter your product specifications below. BIS-AI will automatically map statutory QCO mandates, testing clauses, and certification pathways.
                </p>
              </div>
            </div>

            {/* Product Name */}
            <div className="compliance__field-group">
              <label className="compliance__field-label">
                <Package size={14} className="text-blue" />
                <span>Product Name</span>
                <span className="text-error">*</span>
              </label>
              <div className="compliance__input-glass-wrap">
                <input
                  type="text"
                  className="compliance__glass-input"
                  placeholder="e.g., Electric Storage Water Heater, TMT Steel Bar, LED Driver, Protective Helmet..."
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  required
                  id="compliance-product-name"
                />
              </div>
            </div>

            {/* Grid Row: Category & Standard Ref */}
            <div className="compliance__form-row">
              <div className="compliance__field-group">
                <label className="compliance__field-label">
                  <Layers size={14} className="text-indigo" />
                  <span>Product Category</span>
                </label>
                <div className="compliance__input-glass-wrap">
                  <select
                    className="compliance__glass-input compliance__glass-select"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    id="compliance-category"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="compliance__field-group">
                <label className="compliance__field-label">
                  <BookOpen size={14} className="text-cyan" />
                  <span>Applicable Indian Standard (Optional)</span>
                </label>
                <div className="compliance__input-glass-wrap">
                  <input
                    type="text"
                    className="compliance__glass-input"
                    placeholder="e.g., IS 2082, IS 1786 or leave blank for AI discovery"
                    value={standardRef}
                    onChange={e => setStandardRef(e.target.value)}
                    id="compliance-standard-ref"
                  />
                </div>
              </div>
            </div>

            {/* Grid Row: Applicant Type & Intended Market */}
            <div className="compliance__form-row">
              <div className="compliance__field-group">
                <label className="compliance__field-label">
                  <Building2 size={14} className="text-emerald" />
                  <span>Applicant Entity Type</span>
                </label>
                <div className="compliance__input-glass-wrap">
                  <select
                    className="compliance__glass-input compliance__glass-select"
                    value={manufacturerType}
                    onChange={e => setManufacturerType(e.target.value)}
                    id="compliance-applicant-type"
                  >
                    <option>Domestic Manufacturer</option>
                    <option>Foreign Manufacturer (FMCS)</option>
                    <option>Importer / Brand Owner</option>
                    <option>Trader / Distributor</option>
                  </select>
                </div>
              </div>

              <div className="compliance__field-group">
                <label className="compliance__field-label">
                  <Globe size={14} className="text-blue" />
                  <span>Intended Market</span>
                </label>
                <div className="compliance__input-glass-wrap">
                  <select
                    className="compliance__glass-input compliance__glass-select"
                    value={intendedMarket}
                    onChange={e => setIntendedMarket(e.target.value)}
                    id="compliance-intended-market"
                  >
                    <option>Indian Domestic Market</option>
                    <option>Export Only (from India)</option>
                    <option>Government E-Marketplace (GeM)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="compliance__field-group">
              <label className="compliance__field-label">
                <FileText size={14} className="text-muted" />
                <span>Technical Specifications & Material Details</span>
              </label>
              <div className="compliance__input-glass-wrap">
                <textarea
                  className="compliance__glass-input compliance__glass-textarea"
                  rows={3}
                  placeholder="Mention rated voltage, wattage, pressure rating, material grade, dimensions, chemical properties, or usage environment..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  id="compliance-specs"
                />
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="compliance__form-footer">
              <div className="compliance__footer-meta">
                <Shield size={13} className="text-blue" />
                <span>Powered by BIS-AI Intelligence & Official Gazette Data</span>
              </div>

              <button
                type="submit"
                className={`btn btn-primary compliance__submit-glass-btn ${loading ? 'compliance__submit-glass-btn--loading' : ''}`}
                disabled={loading}
                id="run-compliance-btn"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Evaluating Compliance…</span>
                  </>
                ) : (
                  <>
                    <span>Run Compliance Check</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
