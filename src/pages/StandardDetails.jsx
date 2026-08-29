import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark, BookmarkCheck, ArrowLeft, CheckCircle2, AlertTriangle,
  FileText, FlaskConical, Award, Shield, ExternalLink, ChevronRight,
  Sparkles, Layers, Check, Search, Share2, Scale, Clock, Building2,
  Calendar, CheckCircle
} from 'lucide-react';
import standardsService from '../services/standardsService.js';
import { useApp } from '../context/AppContext.jsx';
import './StandardDetails.css';

const TABS = [
  { id: 'Overview', label: 'Overview', icon: FileText },
  { id: 'Requirements', label: 'Key Requirements', icon: CheckCircle2 },
  { id: 'Testing', label: 'Testing & Lab Protocol', icon: FlaskConical },
  { id: 'Certification', label: 'Certification Pathway', icon: Award },
  { id: 'QCO', label: 'QCO Mandates', icon: Shield },
  { id: 'Sources', label: 'Official Portals', icon: ExternalLink },
];

export default function StandardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSaveStandard, isStandardSaved, addToast } = useApp();
  const [standard, setStandard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    standardsService.getStandard(id)
      .then(setStandard)
      .catch(() => addToast('Standard not found', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      addToast('Link copied to clipboard', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="std-view animate-fade-in">
        <div className="std-view__skeleton-header">
          <div className="skeleton" style={{ height: '24px', width: '140px', borderRadius: '8px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '44px', width: '60%', borderRadius: '12px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '28px', width: '40%', borderRadius: '8px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ height: '180px', borderRadius: '16px' }} />
        </div>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="empty-state animate-fade-in" style={{ padding: '6rem 2rem' }}>
        <FileText className="empty-state-icon" style={{ width: '48px', height: '48px', color: 'var(--text-muted)' }} />
        <h2 className="empty-state-title" style={{ fontSize: '1.5rem', marginTop: '1rem' }}>Standard Not Found</h2>
        <p className="empty-state-text" style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          We could not locate standard reference "{id}".
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/standards')}>
          <ArrowLeft size={16} /> Back to Standards Explorer
        </button>
      </div>
    );
  }

  const saved = isStandardSaved(id);

  return (
    <div className="std-view animate-fade-in">
      {/* Top Bar: Navigation & Actions */}
      <div className="std-view__nav-bar">
        <button className="std-view__back-btn" onClick={() => navigate('/standards')}>
          <ArrowLeft size={16} />
          <span>Standards Explorer</span>
        </button>

        <div className="std-view__top-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleShare} title="Share Link">
            {copied ? <Check size={14} className="text-success" /> : <Share2 size={14} />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
          <button
            className={`btn btn-sm ${saved ? 'btn-secondary' : 'btn-primary'} std-view__save-btn`}
            onClick={() => toggleSaveStandard(id)}
            id="save-standard-btn"
          >
            {saved ? <BookmarkCheck size={15} className="text-primary" /> : <Bookmark size={15} />}
            <span>{saved ? 'Saved in Library' : 'Save Standard'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <motion.div
        className="std-view__hero card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="std-view__hero-badge-row">
          <span className="std-view__code-badge">{standard.number}</span>
          <span className={`badge ${standard.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>
            <span className="std-view__status-dot" />
            {standard.status || 'Active'}
          </span>
          <span className="badge badge-indigo">{standard.category}</span>
          {standard.qcoApplicable && (
            <span className="badge badge-warning flex items-center gap-1">
              <Shield size={11} /> Mandatory QCO
            </span>
          )}
          <span className="badge badge-muted flex items-center gap-1">
            <CheckCircle size={11} className="text-success" /> Scheme-I (ISI Mark)
          </span>
        </div>

        <h1 className="std-view__hero-title">{standard.title}</h1>

        <p className="std-view__hero-desc">
          {standard.scope || standard.overview || 'Official Bureau of Indian Standards specification outlining quality benchmarks, material grades, manufacturing requirements, and mandatory safety test clauses.'}
        </p>

        {/* Quick Hero Metrics Bar */}
        <div className="std-view__hero-meta-grid">
          <div className="std-view__hero-meta-item">
            <span className="std-view__meta-label">Domain</span>
            <span className="std-view__meta-val">{standard.category || 'General Standards'}</span>
          </div>
          <div className="std-view__hero-meta-item">
            <span className="std-view__meta-label">Subcategory</span>
            <span className="std-view__meta-val">{standard.subcategory || standard.category || '—'}</span>
          </div>
          <div className="std-view__hero-meta-item">
            <span className="std-view__meta-label">QCO Status</span>
            <span className="std-view__meta-val text-warning">
              {standard.qcoApplicable ? 'Mandatory Order' : 'Voluntary'}
            </span>
          </div>
          <div className="std-view__hero-meta-item">
            <span className="std-view__meta-label">Authority</span>
            <span className="std-view__meta-val flex items-center gap-1 text-blue-light">
              <Shield size={12} /> Bureau of Indian Standards
            </span>
          </div>
        </div>
      </motion.div>

      {/* Main 2-Column Grid */}
      <div className="std-view__layout">
        {/* Left Main Content (Tabs + Details) */}
        <div className="std-view__main-col">
          {/* Glass Tab Navigation */}
          <div className="std-view__tabs-wrapper">
            <div className="std-view__tabs">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    className={`std-view__tab-btn ${isActive ? 'std-view__tab-btn--active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    id={`tab-${tab.id.toLowerCase()}`}
                  >
                    <Icon size={14} className={isActive ? 'text-primary' : 'text-muted'} />
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        className="std-view__tab-indicator"
                        layoutId="activeTabIndicator"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Cards */}
          <div className="std-view__tab-panel">
            <AnimatePresence mode="wait">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'Overview' && (
                <motion.div
                  key="overview"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <FileText size={18} className="text-primary" />
                    <div>
                      <h2 className="std-view__card-title">Standard Scope & Technical Scope</h2>
                      <p className="std-view__card-subtitle">Official applicability and definition under BIS standard framework</p>
                    </div>
                  </div>

                  <div className="std-view__scope-block">
                    <p className="std-view__scope-text">
                      {standard.scope || 'This Indian Standard prescribes the technical specifications, performance limits, testing methods, and quality benchmarks for products manufactured, imported, or distributed across India.'}
                    </p>
                  </div>

                  {standard.overview && (
                    <div className="std-view__section-group">
                      <h3 className="std-view__subheading">Key Highlights</h3>
                      <p className="std-view__body-text">{standard.overview}</p>
                    </div>
                  )}

                  {/* Feature Highlights Grid */}
                  <div className="std-view__features-grid">
                    <div className="std-view__feature-item">
                      <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                      <div>
                        <div className="std-view__feature-title">Statutory Conformity</div>
                        <div className="std-view__feature-desc">Ensures safety, durability, and statutory compliance with Ministry quality orders.</div>
                      </div>
                    </div>
                    <div className="std-view__feature-item">
                      <FlaskConical size={16} className="text-cyan flex-shrink-0" />
                      <div>
                        <div className="std-view__feature-title">Standardized Laboratory Testing</div>
                        <div className="std-view__feature-desc">Prescribes rigorous batch tests at BIS-recognized & NABL-accredited labs.</div>
                      </div>
                    </div>
                    <div className="std-view__feature-item">
                      <Award size={16} className="text-warning flex-shrink-0" />
                      <div>
                        <div className="std-view__feature-title">BIS Standard Mark (ISI)</div>
                        <div className="std-view__feature-desc">Grant of license allows stamping of the authentic ISI certification mark.</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: REQUIREMENTS */}
              {activeTab === 'Requirements' && (
                <motion.div
                  key="requirements"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <CheckCircle2 size={18} className="text-success" />
                    <div>
                      <h2 className="std-view__card-title">Compliance & Technical Requirements</h2>
                      <p className="std-view__card-subtitle">Mandatory quality thresholds and specifications</p>
                    </div>
                  </div>

                  {standard.requirements && standard.requirements.length > 0 ? (
                    <div className="std-view__req-list">
                      {standard.requirements.map((req, i) => (
                        <div key={req.id || i} className="std-view__req-row">
                          <div className="std-view__req-icon-box">
                            <CheckCircle2 size={15} className="text-success" />
                          </div>
                          <div className="std-view__req-body">
                            <div className="std-view__req-text">{req.text || req}</div>
                            {req.category && (
                              <div className="flex items-center gap-2 mt-2">
                                <span className="badge badge-muted text-xs">{req.category}</span>
                                {req.mandatory && (
                                  <span className="badge badge-warning text-xs">Mandatory Clause</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="std-view__fallback-box">
                      <p>
                        Specific chemical, physical, and mechanical requirements for <strong>{standard.number}</strong> are detailed in the official standard. Use our AI Assistant to generate clause-by-clause parameters.
                      </p>
                      <button
                        className="btn btn-secondary btn-sm mt-3"
                        onClick={() => navigate(`/assistant?q=${encodeURIComponent(`What are the key technical requirements and clauses in ${standard.number}?`)}`)}
                      >
                        <Sparkles size={13} /> Ask BIS-AI for Requirements
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: TESTING */}
              {activeTab === 'Testing' && (
                <motion.div
                  key="testing"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <FlaskConical size={18} className="text-cyan" />
                    <div>
                      <h2 className="std-view__card-title">Testing Protocols & Laboratory Verification</h2>
                      <p className="std-view__card-subtitle">Required safety, endurance, and performance testing</p>
                    </div>
                  </div>

                  {standard.testing ? (
                    <div>
                      <div className="std-view__test-metrics-grid mb-4">
                        <div className="std-view__test-metric-card">
                          <span className="std-view__meta-label">Estimated Test Duration</span>
                          <span className="std-view__meta-val text-primary">{standard.testing.duration || '2 to 4 Weeks'}</span>
                        </div>
                        <div className="std-view__test-metric-card">
                          <span className="std-view__meta-label">Recognized Laboratories</span>
                          <span className="std-view__meta-val text-cyan">{standard.testing.labs ? `${standard.testing.labs}+ BIS Labs` : 'BIS & NABL Labs'}</span>
                        </div>
                      </div>

                      <h3 className="std-view__subheading">Prescribed Laboratory Tests</h3>
                      <div className="std-view__test-grid">
                        {standard.testing.keyTests?.map((test, i) => (
                          <div key={i} className="std-view__test-card">
                            <FlaskConical size={14} className="text-cyan flex-shrink-0" />
                            <span>{test}</span>
                          </div>
                        ))}
                      </div>

                      <div className="std-view__test-footer">
                        <button className="btn btn-secondary" onClick={() => navigate('/laboratories')}>
                          <FlaskConical size={14} /> Find BIS Testing Laboratories
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="std-view__fallback-box">
                      <p>Standard testing methods include sample preparation, tensile/strength tests, safety verification, and endurance protocols.</p>
                      <button className="btn btn-secondary btn-sm mt-3" onClick={() => navigate('/laboratories')}>
                        <FlaskConical size={13} /> View Recognized Testing Labs
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: CERTIFICATION */}
              {activeTab === 'Certification' && (
                <motion.div
                  key="certification"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <Award size={18} className="text-warning" />
                    <div>
                      <h2 className="std-view__card-title">BIS Certification Pathway</h2>
                      <p className="std-view__card-subtitle">Step-by-step grant of BIS Standard Mark (ISI) license</p>
                    </div>
                  </div>

                  <div className="std-view__scheme-banner mb-4">
                    <div className="section-label text-xs mb-1">Applicable Scheme</div>
                    <div className="font-semibold text-primary">{standard.certification?.scheme || 'Scheme-I: BIS Product Certification (ISI Mark Scheme)'}</div>
                  </div>

                  <h3 className="std-view__subheading">Standard Certification Process</h3>
                  <div className="std-view__steps-timeline">
                    {(standard.certification?.process || [
                      'Online Application Submission on BIS Manakonline (manakonline.in)',
                      'Factory Audit & Quality Management System (QMS) Inspection by BIS Officials',
                      'Drawal of Independent Test Samples for Verification at BIS-Recognized Lab',
                      'Technical Scrutiny of Test Reports & Acceptance Criteria Verification',
                      'Grant of BIS License (Standard Mark / ISI Stamping Permission)'
                    ]).map((step, i) => (
                      <div key={i} className="std-view__timeline-item">
                        <div className="std-view__timeline-num">{String(i + 1).padStart(2, '0')}</div>
                        <div className="std-view__timeline-content">{step}</div>
                      </div>
                    ))}
                  </div>

                  <div className="std-view__test-footer">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate('/compliance')}
                    >
                      <CheckCircle2 size={14} /> Start Product Compliance Check
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: QCO */}
              {activeTab === 'QCO' && (
                <motion.div
                  key="qco"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <Shield size={18} className="text-warning" />
                    <div>
                      <h2 className="std-view__card-title">Quality Control Order (QCO) Regulatory Status</h2>
                      <p className="std-view__card-subtitle">Statutory orders issued by Government of India Ministries</p>
                    </div>
                  </div>

                  <div className={`std-view__qco-status-box ${standard.qcoApplicable ? 'std-view__qco-status-box--mandatory' : ''}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Shield size={16} className={standard.qcoApplicable ? 'text-warning' : 'text-muted'} />
                      <span className="font-semibold">
                        {standard.qcoApplicable ? 'Mandatory Quality Control Order (QCO) In Effect' : 'Voluntary Compliance Standard'}
                      </span>
                    </div>
                    <p className="std-view__body-text text-sm">
                      {standard.qcoApplicable
                        ? `Products covered under ${standard.number} cannot be manufactured, imported, distributed, or sold in India without bearing the valid BIS Standard Mark (ISI). Non-compliance attracts statutory penalties under Section 29 of the BIS Act, 2016.`
                        : `This standard is currently voluntary, though manufacturers can obtain the BIS Standard Mark to demonstrate certified quality and customer trust.`
                      }
                    </p>
                  </div>

                  <div className="std-view__features-grid mt-4">
                    <div className="std-view__feature-item">
                      <Building2 size={16} className="text-blue-light flex-shrink-0" />
                      <div>
                        <div className="std-view__feature-title">Enforcing Ministry</div>
                        <div className="std-view__feature-desc">Department for Promotion of Industry and Internal Trade (DPIIT) / Relevant Ministry</div>
                      </div>
                    </div>
                    <div className="std-view__feature-item">
                      <Scale size={16} className="text-warning flex-shrink-0" />
                      <div>
                        <div className="std-view__feature-title">Statutory Basis</div>
                        <div className="std-view__feature-desc">Bureau of Indian Standards Act, 2016 (Act No. 11 of 2016)</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 6: SOURCES */}
              {activeTab === 'Sources' && (
                <motion.div
                  key="sources"
                  className="std-view__card card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="std-view__card-header">
                    <ExternalLink size={18} className="text-primary" />
                    <div>
                      <h2 className="std-view__card-title">Official BIS Government Portals & Documents</h2>
                      <p className="std-view__card-subtitle">Authoritative links to official BIS portals</p>
                    </div>
                  </div>

                  <div className="std-view__sources-grid">
                    <div className="std-view__source-box">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="badge badge-muted text-xs">Official Portal</span>
                        <span className="text-xs text-blue-light font-mono">bis.gov.in</span>
                      </div>
                      <div className="std-view__source-title">Bureau of Indian Standards — National Standards Portal</div>
                      <p className="std-view__source-desc">Official BIS portal for standards formulation, gazette notifications, and QCO orders.</p>
                      <a
                        href={`https://www.bis.gov.in/?s=${encodeURIComponent(standard.number)}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-secondary btn-sm mt-3"
                      >
                        <ExternalLink size={12} /> Open BIS Portal
                      </a>
                    </div>

                    <div className="std-view__source-box">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="badge badge-muted text-xs">Conformity Assessment</span>
                        <span className="text-xs text-blue-light font-mono">manakonline.in</span>
                      </div>
                      <div className="std-view__source-title">BIS Manakonline — e-BIS Certification System</div>
                      <p className="std-view__source-desc">Online application filing, license management, and Know Your Standard lookup.</p>
                      <a
                        href="https://www.manakonline.in/MANAK/knowYourStandards"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="btn btn-secondary btn-sm mt-3"
                      >
                        <ExternalLink size={12} /> Open Manakonline
                      </a>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sticky Sidebar (Summary & Quick Actions) */}
        <div className="std-view__sidebar-col">
          {/* Quick Specifications Card */}
          <div className="std-view__side-card card">
            <div className="std-view__side-header">
              <Shield size={16} className="text-primary" />
              <span className="font-semibold text-sm">Standard Specification</span>
            </div>

            <div className="std-view__spec-list">
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">IS Number</span>
                <span className="std-view__spec-val font-mono font-bold text-blue-light">{standard.number}</span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">Category</span>
                <span className="std-view__spec-val">{standard.category}</span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">Subcategory</span>
                <span className="std-view__spec-val">{standard.subcategory || '—'}</span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">Status</span>
                <span className="std-view__spec-val text-success font-semibold">{standard.status || 'Active'}</span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">BIS Mark Scheme</span>
                <span className="std-view__spec-val">
                  {standard.bisMarkRequired ? 'Mandatory ISI Stamping' : 'Voluntary Scheme'}
                </span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">QCO Order</span>
                <span className="std-view__spec-val text-warning">
                  {standard.qcoApplicable ? 'Statutory QCO' : 'None'}
                </span>
              </div>
              <div className="std-view__spec-item">
                <span className="std-view__spec-label">Last Updated</span>
                <span className="std-view__spec-val">{standard.lastUpdated || '2023-01-01'}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="std-view__side-card card">
            <div className="std-view__side-header">
              <Sparkles size={16} className="text-primary" />
              <span className="font-semibold text-sm">Smart Tools</span>
            </div>

            <div className="std-view__action-list">
              <button
                className="btn btn-gradient w-full justify-center"
                onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain technical requirements, testing clauses, and QCO for ${standard.number} (${standard.title})`)}`)}
              >
                <Sparkles size={14} /> Ask BIS-AI About Standard
              </button>

              <button
                className="btn btn-secondary w-full justify-center"
                onClick={() => navigate(`/compliance?std=${encodeURIComponent(standard.number)}`)}
              >
                <CheckCircle2 size={14} /> Check Product Compliance
              </button>

              <button
                className="btn btn-ghost w-full justify-center text-secondary"
                onClick={() => navigate('/compare')}
              >
                <Scale size={14} /> Compare with Another Standard
              </button>
            </div>
          </div>

          {/* Verification Badge Box */}
          <div className="std-view__trust-box">
            <Shield size={14} className="text-success flex-shrink-0" />
            <span className="text-xs text-secondary">
              Verified against official Bureau of Indian Standards (BIS) gazette records.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
