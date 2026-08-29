import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, CheckCircle, AlertTriangle, X, Shield, 
  Sparkles, Camera, Tag, FlaskConical, Scale, ArrowRight, 
  Layers, CheckCircle2, MessageSquare, Info
} from 'lucide-react';
import documentService from '../services/documentService.js';
import { useApp } from '../context/AppContext.jsx';
import './Documents.css';

export default function Documents() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | done
  const [result, setResult] = useState(null);
  const [pastDocs, setPastDocs] = useState([]);
  const fileRef = useRef();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const loadPastDocs = async () => {
    try {
      const docs = await documentService.getDocuments();
      setPastDocs(docs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  useEffect(() => {
    loadPastDocs();
  }, []);

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);

    // Create image preview if file is an image
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl(null);
    }

    setStage('uploading');
    addToast('Uploading image / document to BIS Vision AI...', 'info');

    try {
      setTimeout(() => setStage('analyzing'), 600);
      const analysis = await documentService.analyzeDocument(f);
      setResult(analysis);
      setStage('done');
      addToast('Product successfully identified & analyzed by BIS AI', 'success');
      loadPastDocs();
    } catch (err) {
      addToast(err.message || 'Analysis failed. Please try again.', 'error');
      setStage('idle');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setStage('idle');
    setResult(null);
  };

  const productName = result?.product_name || result?.applicable_standard?.title || file?.name || 'Identified Product';
  const category = result?.category || 'General Product';
  const applicableStd = result?.applicable_standard;
  const qco = result?.qco_mandate;
  const certScheme = result?.certification_scheme;
  const detectedMarkings = result?.detected_markings || [];
  const extractedRequirements = result?.extracted_requirements || result?.extractedRequirements || [];
  const testingClauses = result?.testing_clauses || [];
  const complianceGaps = result?.compliance_gaps || result?.complianceGaps || [];
  const referencedStandards = result?.referenced_standards || result?.referencedStandards || [];
  const authLabs = result?.authorized_laboratories || [];
  const uploadTime = result?.uploaded_at || result?.uploadedAt || new Date().toISOString();
  const fileSize = result?.file_size || result?.fileSize || '1.8 MB';

  const handleAskInChat = () => {
    const stdRef = applicableStd?.number || '';
    const query = `Explain the mandatory BIS certification process, testing requirements, and QCO order for ${productName} (${stdRef})`;
    navigate(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="documents animate-fade-in">
      <div className="page-header">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Camera size={26} className="text-gradient-ai" /> Photo Product Identification &amp; Analysis
            </h1>
            <p className="page-subtitle">
              Upload a photo of any product, nameplate, or specification sheet. Vision AI automatically identifies the product and its mandatory BIS standards.
            </p>
          </div>
          <div className="badge badge-blue" style={{ width: 'fit-content' }}>
            <Shield size={12} />
            Gemini Multimodal Vision + BIS RAG
          </div>
        </div>
      </div>

      {stage === 'idle' && (
        <div
          className={`documents__drop-zone ${dragging ? 'documents__drop-zone--active' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload photo or document for analysis"
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          id="document-upload-zone"
        >
          <input 
            ref={fileRef} 
            type="file" 
            accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.doc" 
            hidden 
            onChange={e => handleFile(e.target.files[0])} 
          />
          <div className="documents__drop-icon-wrap">
            <Upload size={36} className="documents__drop-icon" />
          </div>
          <h3>Snap or drop a product photo here</h3>
          <p>or click to browse product photos &amp; specifications</p>
          <div className="documents__file-types">
            <span className="badge badge-blue">📷 Photos (JPG, PNG, WEBP)</span>
            <span className="badge badge-muted">📄 PDFs &amp; Specs</span>
          </div>
          <p className="documents__drop-limit">Supports physical appliances, equipment nameplates, helmets, steel, chargers, toys, etc.</p>
        </div>
      )}

      {(stage === 'uploading' || stage === 'analyzing') && (
        <div className="documents__progress card animate-fade-in">
          {previewUrl ? (
            <div className="documents__preview-thumbnail">
              <img src={previewUrl} alt="Uploaded product" />
            </div>
          ) : (
            <div className="compliance__loading-orb"><div className="compliance__spinner" /></div>
          )}
          <h3>{stage === 'uploading' ? 'Uploading product photo...' : 'Vision AI is identifying product & BIS standards...'}</h3>
          <p className="text-secondary">{file?.name}</p>
          <div className="progress-bar" style={{ width: '320px', margin: '14px 0' }}>
            <div className="progress-fill" style={{ width: stage === 'uploading' ? '40%' : '90%', transition: 'width 1.5s ease' }} />
          </div>
          <p className="text-muted text-xs">
            {stage === 'analyzing' 
              ? 'Analyzing visual features, inspecting markings, and querying BIS pgvector database…' 
              : 'Please wait…'}
          </p>
        </div>
      )}

      {stage === 'done' && result && (
        <div className="documents__result animate-fade-in">
          {/* Top Bar with File Details & Action */}
          <div className="documents__result-header card">
            <div className="flex items-center gap-3">
              {previewUrl ? (
                <img src={previewUrl} alt="Analyzed" className="documents__result-thumb" />
              ) : (
                <div className="documents__file-icon"><FileText size={20} /></div>
              )}
              <div>
                <div className="font-semibold text-base">{result.filename || file?.name}</div>
                <div className="text-muted text-xs">{fileSize} · Analyzed {new Date(uploadTime).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleAskInChat}>
                <MessageSquare size={14} /> Ask BIS-AI in Chat
              </button>
              <button className="btn btn-ghost btn-sm" onClick={reset}>
                <X size={14} /> Analyze Another
              </button>
            </div>
          </div>

          {/* Hero: AI Identified Product Card */}
          <div className="documents__hero-card card">
            <div className="documents__hero-badge">
              <Sparkles size={14} /> Vision AI Identification
            </div>
            <div className="documents__hero-body">
              <div className="documents__hero-info">
                <div className="documents__hero-category badge badge-indigo">{category}</div>
                <h2 className="documents__hero-title">{productName}</h2>
                <p className="documents__hero-summary">{result.summary}</p>

                {detectedMarkings.length > 0 && (
                  <div className="documents__markings-wrap">
                    <span className="text-xs text-muted font-medium">Detected Markings &amp; Specs:</span>
                    <div className="documents__markings-tags">
                      {detectedMarkings.map((m, i) => (
                        <span key={i} className="documents__tag badge badge-muted">
                          <Tag size={10} /> {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {applicableStd && (
                <div className="documents__hero-standard card">
                  <span className="section-label">Applicable Indian Standard</span>
                  <div className="documents__std-highlight">{applicableStd.number}</div>
                  <div className="documents__std-title">{applicableStd.title}</div>
                  <div className="verified-badge" style={{ marginTop: 8 }}>
                    <Shield size={11} /> {applicableStd.status || 'Active Indian Standard'}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="documents__result-grid">
            {/* QCO Mandate & Certification Scheme */}
            {qco && (
              <div className="card">
                <h3 className="documents__section-title flex items-center gap-2">
                  <Shield size={16} className="text-blue" /> Statutory QCO Mandate Status
                </h3>
                <div className="documents__qco-box">
                  <div className={`badge ${qco.is_mandatory ? 'badge-blue' : 'badge-muted'}`} style={{ marginBottom: 8 }}>
                    {qco.is_mandatory ? 'Mandatory Quality Control Order (QCO)' : 'Voluntary Standard'}
                  </div>
                  <div className="font-semibold text-sm">{qco.qco_order_name || 'BIS Statutory Notification'}</div>
                  <p className="text-secondary text-xs" style={{ marginTop: 4 }}>{qco.effective_status}</p>
                  {qco.penalties && (
                    <p className="text-muted text-xs" style={{ marginTop: 6, fontStyle: 'italic' }}>
                      ⚠️ {qco.penalties}
                    </p>
                  )}
                </div>

                {certScheme && (
                  <div className="documents__scheme-box">
                    <span className="text-xs text-muted font-medium">Certification Scheme:</span>
                    <div className="font-semibold text-sm text-gradient-ai">{certScheme.scheme}</div>
                    <p className="text-secondary text-xs" style={{ marginTop: 2 }}>{certScheme.process}</p>
                  </div>
                )}
              </div>
            )}

            {/* Mandatory Testing Clauses */}
            {testingClauses.length > 0 && (
              <div className="card">
                <h3 className="documents__section-title flex items-center gap-2">
                  <FlaskConical size={16} className="text-cyan" /> Laboratory Testing Protocols
                </h3>
                <div className="documents__test-list">
                  {testingClauses.map((t, i) => (
                    <div key={i} className="documents__test-item">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-medium text-sm">{t.test_name}</span>
                        {t.clause && <span className="badge badge-muted text-xs">{t.clause}</span>}
                      </div>
                      <p className="text-muted text-xs" style={{ marginTop: 3 }}>{t.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Requirements */}
            <div className="card">
              <h3 className="documents__section-title flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green" /> Key Technical Requirements
              </h3>
              <div className="documents__req-list">
                {extractedRequirements.map((req, i) => (
                  <div key={i} className="documents__req-item">
                    <span className="badge badge-indigo">{req.category || 'Specification'}</span>
                    <span className="text-sm">{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Gaps & Action Items */}
            <div className="card">
              <h3 className="documents__section-title flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber" /> Compliance Gaps &amp; Verification
              </h3>
              <div className="documents__gap-list">
                {complianceGaps.map((gap, i) => (
                  <div key={i} className={`documents__gap-item documents__gap-item--${gap.severity || 'medium'}`}>
                    <AlertTriangle size={14} />
                    <span className="text-sm">{gap.issue}</span>
                    <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>{gap.severity}</span>
                  </div>
                ))}
              </div>

              {authLabs.length > 0 && (
                <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                  <span className="text-xs text-muted font-medium">Authorized Test Facilities:</span>
                  <ul className="documents__labs-list">
                    {authLabs.map((lab, i) => (
                      <li key={i} className="text-xs text-secondary">{lab}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
