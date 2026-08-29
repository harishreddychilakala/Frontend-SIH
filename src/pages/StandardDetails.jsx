import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bookmark, BookmarkCheck, ArrowLeft, CheckCircle, AlertTriangle,
  FileText, FlaskConical, Award, Shield, ExternalLink, ChevronRight
} from 'lucide-react';
import standardsService from '../services/standardsService.js';
import { useApp } from '../context/AppContext.jsx';
import './StandardDetails.css';

const tabs = ['Overview', 'Requirements', 'Testing', 'Certification', 'QCO', 'Sources'];

export default function StandardDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSaveStandard, isStandardSaved, addToast } = useApp();
  const [standard, setStandard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    standardsService.getStandard(id)
      .then(setStandard)
      .catch(() => addToast('Standard not found', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="standard-details animate-fade-in">
        <div className="standard-details__skeleton">
          <div className="skeleton" style={{ height: '40px', width: '60%', marginBottom: '16px' }} />
          <div className="skeleton" style={{ height: '20px', width: '80%', marginBottom: '32px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
        </div>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="empty-state">
        <FileText className="empty-state-icon" />
        <p className="empty-state-title">Standard not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/standards')}>Back to Standards</button>
      </div>
    );
  }

  const saved = isStandardSaved(id);

  return (
    <div className="standard-details animate-fade-in">
      {/* Back */}
      <button className="btn btn-ghost btn-sm standard-details__back" onClick={() => navigate('/standards')}>
        <ArrowLeft size={15} /> Back to Standards
      </button>

      {/* Header */}
      <div className="standard-details__header">
        <div className="standard-details__header-main">
          <div className="standard-details__number-badge">
            {standard.number}
          </div>
          <div className="standard-details__header-info">
            <h1 className="standard-details__title">{standard.title}</h1>
            <div className="standard-details__meta">
              <span className={`badge ${standard.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>
                {standard.status}
              </span>
              <span className="badge badge-indigo">{standard.category}</span>
              {standard.qcoApplicable && <span className="badge badge-warning">QCO Applicable</span>}
              <div className="verified-badge">
                <Shield size={10} /> Verified Standard
              </div>
            </div>
          </div>
          <button
            className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => toggleSaveStandard(id)}
            id="save-standard-btn"
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>

        {/* Right sidebar summary */}
        <div className="standard-details__summary-card card">
          <div className="standard-details__summary-item">
            <span className="section-label">Category</span>
            <span>{standard.category}</span>
          </div>
          <div className="standard-details__summary-item">
            <span className="section-label">Subcategory</span>
            <span>{standard.subcategory || '—'}</span>
          </div>
          <div className="standard-details__summary-item">
            <span className="section-label">Last Updated</span>
            <span>{standard.lastUpdated}</span>
          </div>
          <div className="standard-details__summary-item">
            <span className="section-label">BIS Mark Required</span>
            <span>{standard.bisMarkRequired ? 'Yes (Mandatory)' : 'Voluntary'}</span>
          </div>
          <div className="standard-details__summary-item">
            <span className="section-label">QCO Applicable</span>
            <span>{standard.qcoApplicable ? 'Yes (Mandatory QCO)' : 'Voluntary'}</span>
          </div>
          <div className="standard-details__summary-item">
            <span className="section-label">Verification</span>
            <div className="verified-badge">
              <Shield size={9} /> Official BIS Index
            </div>
          </div>
          <button
            className="btn btn-gradient w-full"
            style={{ marginTop: 'var(--space-3)' }}
            onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain technical requirements, testing clauses, and QCO for ${standard.number} (${standard.title})`)}`)}
          >
            <Shield size={15} /> Ask BIS-AI About Standard
          </button>
          <button
            className="btn btn-secondary w-full"
            style={{ marginTop: '8px' }}
            onClick={() => navigate('/compliance')}
          >
            Check Product Compliance
          </button>
          <button
            className="btn btn-ghost w-full btn-sm"
            style={{ marginTop: '4px' }}
            onClick={() => navigate('/compare')}
          >
            Compare with Another Standard
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="standard-details__tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`standard-details__tab ${activeTab === tab ? 'standard-details__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
            id={`tab-${tab.toLowerCase()}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="standard-details__content">
        {activeTab === 'Overview' && (
          <div className="animate-fade-in">
            <div className="demo-notice mb-4">Demo Data — This content is illustrative only.</div>
            <h3>Scope</h3>
            <p style={{ marginTop: '12px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
              {standard.scope || 'This standard covers requirements and test methods for products in this category. Scope details are available in the full standard document from BIS.'}
            </p>
            {standard.overview && (
              <>
                <h3 style={{ marginTop: '24px' }}>Overview</h3>
                <p style={{ marginTop: '12px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>{standard.overview}</p>
              </>
            )}
          </div>
        )}

        {activeTab === 'Requirements' && (
          <div className="animate-fade-in">
            <div className="demo-notice mb-4">Requirements shown are illustrative. Verify with the actual standard document.</div>
            {standard.requirements ? (
              <div className="standard-details__requirements">
                {standard.requirements.map((req) => (
                  <div key={req.id} className="standard-details__requirement">
                    <CheckCircle size={16} className="standard-details__req-icon" />
                    <div className="standard-details__req-content">
                      <span className="standard-details__req-text">{req.text}</span>
                      <div className="flex gap-2 mt-1">
                        <span className="badge badge-muted">{req.category}</span>
                        {req.mandatory && <span className="badge badge-error" style={{ fontSize: '10px' }}>Mandatory</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary">Requirements are available in the full standard document from BIS.</p>
            )}
          </div>
        )}

        {activeTab === 'Testing' && (
          <div className="animate-fade-in">
            <div className="demo-notice mb-4">Testing information is illustrative. Consult BIS for current requirements.</div>
            {standard.testing ? (
              <div className="standard-details__testing">
                <div className="standard-details__testing-info card mb-4">
                  <div className="flex gap-6">
                    <div>
                      <div className="section-label mb-1">Duration</div>
                      <span className="font-semibold">{standard.testing.duration}</span>
                    </div>
                    <div>
                      <div className="section-label mb-1">BIS-recognized labs</div>
                      <span className="font-semibold">{standard.testing.labs}+ known</span>
                    </div>
                  </div>
                </div>
                <h3 style={{ marginBottom: '12px' }}>Key Tests Required</h3>
                <div className="standard-details__test-list">
                  {standard.testing.keyTests?.map((test, i) => (
                    <div key={i} className="standard-details__test-item">
                      <FlaskConical size={14} className="text-cyan" />
                      <span>{test}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/laboratories')}>
                    <FlaskConical size={15} /> Find Testing Laboratories
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-secondary">Testing requirements are available in the full standard. Find recognized laboratories in the Laboratories section.</p>
            )}
          </div>
        )}

        {activeTab === 'Certification' && (
          <div className="animate-fade-in">
            <div className="demo-notice mb-4">Certification information is illustrative. Contact BIS for official process.</div>
            {standard.certification ? (
              <div>
                <div className="card mb-4">
                  <div className="section-label mb-2">Certification Scheme</div>
                  <span className="font-semibold">{standard.certification.scheme}</span>
                </div>
                <h3 style={{ marginBottom: '12px' }}>Process Steps</h3>
                <div className="standard-details__process">
                  {standard.certification.process?.map((step, i) => (
                    <div key={i} className="standard-details__process-step">
                      <div className="standard-details__process-num">{String(i + 1).padStart(2, '0')}</div>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-secondary">Certification details are provided by BIS. Use our AI assistant to get more information about this standard's certification requirements.</p>
            )}
          </div>
        )}

        {activeTab === 'QCO' && (
          <div className="animate-fade-in">
            <div className="standard-details__qco-card card">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={20} className="text-blue" />
                <h3>Quality Control Order Status</h3>
              </div>
              {standard.qcoApplicable ? (
                <div>
                  <div className="badge badge-warning" style={{ marginBottom: '12px', fontSize: '13px', padding: '6px 12px' }}>
                    <AlertTriangle size={12} /> QCO May Be Applicable
                  </div>
                  <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                    Based on available information, this product category may fall under Quality Control Order requirements. 
                    Verify the latest QCO notifications from DPIIT and BIS for current applicability and requirements.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="badge badge-muted" style={{ marginBottom: '12px', fontSize: '13px', padding: '6px 12px' }}>
                    QCO Not Identified
                  </div>
                  <p className="text-secondary" style={{ lineHeight: '1.7' }}>
                    No specific QCO requirement was identified for this standard in our database. 
                    However, always verify with official DPIIT and BIS sources as QCO notifications are updated periodically.
                  </p>
                </div>
              )}
              <div className="needs-verification-badge" style={{ marginTop: '16px', width: 'fit-content' }}>
                <AlertTriangle size={10} /> Verify with official BIS/DPIIT sources
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Sources' && (
          <div className="animate-fade-in">
            <div className="demo-notice mb-4">Sources are indicative. Always verify with official BIS website.</div>
            <div className="standard-details__sources">
              <div className="standard-details__source-card card">
                <div className="section-label mb-2">Official Standard Document</div>
                <div className="font-semibold">{standard.number} — {standard.title}</div>
                <div className="text-muted text-xs mt-1">bis.gov.in</div>
                <div className="flex gap-2 mt-3">
                  <div className="verified-badge"><Shield size={9} /> Official BIS Reference</div>
                  <button className="btn btn-secondary btn-sm">
                    <ExternalLink size={12} /> View at BIS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
