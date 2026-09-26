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

    const isPdf = f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf');

    // Create image preview if file is an image
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreviewUrl(null);
    }

    setStage('uploading');
    addToast(isPdf ? 'Uploading PDF for semantic text extraction & vector indexing...' : 'Uploading image to BIS Vision AI...', 'info');

    try {
      setTimeout(() => setStage('extracting'), 600);
      setTimeout(() => setStage('indexing'), 1400);

      const analysis = await documentService.analyzeDocument(f);
      setResult(analysis);
      setStage('done');
      addToast(isPdf ? 'PDF text extracted & indexed into pgvector for Q&A' : 'Product successfully identified & analyzed by BIS AI', 'success');
      loadPastDocs();
    } catch (err) {
      addToast(err.message || 'Processing failed. Please upload a valid document.', 'error');
      setStage('idle');
    }
  };

  const handleDeleteDoc = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await documentService.deleteDocument(id);
      addToast('Document and vector chunks removed', 'info');
      loadPastDocs();
      if (result && result.id === id) {
        reset();
      }
    } catch (err) {
      addToast('Failed to delete document', 'error');
    }
  };

  const handleSelectPastDoc = (doc) => {
    setResult(doc.analysis_result || { filename: doc.filename, summary: 'Uploaded document record' });
    setFile({ name: doc.filename });
    setStage('done');
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

  const productName = result?.product_name || result?.applicable_standard?.title || file?.name || 'Processed Document';
  const category = result?.category || 'Technical Document';
  const applicableStd = result?.applicable_standard;
  const qco = result?.qco_mandate;
  const certScheme = result?.certification_scheme;
  const detectedMarkings = result?.detected_markings || [];
  const extractedRequirements = result?.extracted_requirements || result?.extractedRequirements || [];
  const testingClauses = result?.testing_clauses || [];
  const complianceGaps = result?.compliance_gaps || result?.complianceGaps || [];
  const authLabs = result?.authorized_laboratories || [];
  const uploadTime = result?.uploaded_at || result?.uploadedAt || new Date().toISOString();
  const fileSize = result?.file_size || result?.fileSize || '1.8 MB';
  const pageCount = result?.page_count;
  const chunksIndexed = result?.chunks_indexed;
  const isRagIndexed = result?.rag_indexed;

  const handleAskInChat = () => {
    const docName = result?.filename || file?.name || 'document';
    const query = isRagIndexed
      ? `Based on the uploaded document '${docName}', what are the primary technical requirements, testing clauses, and compliance standards?`
      : `Explain the mandatory BIS certification process, testing requirements, and QCO order for ${productName}`;
    navigate(`/assistant?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="documents animate-fade-in">
      <div className="page-header">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <div>
            <h1 className="page-title flex items-center gap-2">
              <FileText size={26} className="text-gradient-ai" /> Document Processing &amp; Product Analysis
            </h1>
            <p className="page-subtitle">
              Upload PDF technical specifications, test reports, or product photos. AI extracts clauses, indexes vector embeddings, and enables grounded Q&amp;A retrieval.
            </p>
          </div>
          <div className="badge badge-blue" style={{ width: 'fit-content' }}>
            <Shield size={12} />
            PDF RAG Vector Indexing + Gemini Vision AI
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
            accept=".pdf,.png,.jpg,.jpeg,.webp,.docx,.doc" 
            hidden 
            onChange={e => handleFile(e.target.files[0])} 
          />
          <div className="documents__drop-icon-wrap">
            <Upload size={36} className="documents__drop-icon" />
          </div>
          <h3>Snap a product photo or drop a PDF document</h3>
          <p>Click to browse technical specifications, test reports, or appliance nameplates</p>
          <div className="documents__file-types">
            <span className="badge badge-blue">📄 PDFs &amp; Standards (Full RAG Indexing)</span>
            <span className="badge badge-indigo">📷 Product Photos (Vision AI)</span>
          </div>
          <p className="documents__drop-limit">Supports technical standards, lab reports, equipment specifications, ceiling fans, steel rebars, electronics, etc.</p>
        </div>
      )}

      {(stage === 'uploading' || stage === 'extracting' || stage === 'indexing' || stage === 'analyzing') && (
        <div className="documents__progress card animate-fade-in">
          {previewUrl ? (
            <div className="documents__preview-thumbnail">
              <img src={previewUrl} alt="Uploaded product" />
            </div>
          ) : (
            <div className="compliance__loading-orb"><div className="compliance__spinner" /></div>
          )}
          <h3>
            {stage === 'uploading' && 'Uploading document to server...'}
            {stage === 'extracting' && 'Extracting text and preserving page boundaries...'}
            {stage === 'indexing' && 'Generating vector embeddings & indexing into pgvector...'}
            {stage === 'analyzing' && 'Analyzing compliance parameters with BIS AI...'}
          </h3>
          <p className="text-secondary">{file?.name}</p>
          <div className="progress-bar" style={{ width: '320px', margin: '14px 0' }}>
            <div
              className="progress-fill"
              style={{
                width: stage === 'uploading' ? '30%' : stage === 'extracting' ? '60%' : stage === 'indexing' ? '85%' : '95%',
                transition: 'width 0.8s ease'
              }}
            />
          </div>
          <p className="text-muted text-xs">
            {stage === 'indexing'
              ? 'Splitting text into overlapping semantic chunks and embedding with Gemini 768-dim model…'
              : 'Processing document structure and extracting technical clauses…'}
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
                <div className="text-muted text-xs">
                  {fileSize}
                  {pageCount && ` · ${pageCount} Pages`}
                  {chunksIndexed && ` · ${chunksIndexed} Vector Chunks Indexed`}
                  {` · Analyzed ${new Date(uploadTime).toLocaleString('en-IN')}`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-primary btn-sm" onClick={handleAskInChat}>
                <MessageSquare size={14} /> Ask BIS-AI in Chat
              </button>
              <button className="btn btn-ghost btn-sm" onClick={reset}>
                <X size={14} /> Upload Another
              </button>
            </div>
          </div>

          {/* Hero: AI Identified Product / Document Card */}
          <div className="documents__hero-card card">
            <div className="documents__hero-badge">
              <Sparkles size={14} /> {isRagIndexed ? 'RAG Vector Indexed Document' : 'Vision AI Analysis'}
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
                  <div className="documents__std-highlight">{applicableStd.number || 'IS Specification'}</div>
                  <div className="documents__std-title">{applicableStd.title || 'Standard Title'}</div>
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
                        <span className="font-medium text-sm">{t.test_name || t}</span>
                        {t.clause && <span className="badge badge-muted text-xs">{t.clause}</span>}
                      </div>
                      {t.description && <p className="text-muted text-xs" style={{ marginTop: 3 }}>{t.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Requirements */}
            {extractedRequirements.length > 0 && (
              <div className="card">
                <h3 className="documents__section-title flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-green" /> Key Technical Requirements
                </h3>
                <div className="documents__req-list">
                  {extractedRequirements.map((req, i) => (
                    <div key={i} className="documents__req-item">
                      <span className="badge badge-indigo">{req.category || 'Specification'}</span>
                      <span className="text-sm">{req.text || req}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Uploaded Documents Library Section ── */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-primary flex items-center gap-2">
              <Layers size={17} className="text-blue" />
              <span>Processed Documents Library ({pastDocs.length})</span>
            </h3>
            <p className="text-xs text-muted">
              All indexed PDFs and photo analyses stored with user isolation. Click &apos;Ask in Chat&apos; to query with grounded RAG.
            </p>
          </div>
        </div>

        {pastDocs.length === 0 ? (
          <div className="empty-state" style={{ padding: '24px 12px' }}>
            <FileText size={28} className="empty-state-icon" style={{ margin: '0 auto 8px', color: 'var(--text-muted)' }} />
            <p className="empty-state-title" style={{ fontSize: 'var(--text-sm)' }}>No documents uploaded yet</p>
            <p className="empty-state-description" style={{ fontSize: 'var(--text-xs)' }}>
              Upload your first PDF technical document or product photo above to enable AI analysis and RAG search.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pastDocs.map((d) => (
              <div
                key={d.id}
                className="compliance__history-item"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSelectPastDoc(d)}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-primary">{d.filename}</span>
                    <span className="badge badge-blue text-xs">{d.file_type?.includes('pdf') ? 'PDF Document' : 'Photo Image'}</span>
                    <span className="badge badge-success text-xs">Indexed for RAG</span>
                  </div>
                  <div className="text-xs text-muted">
                    Uploaded: {new Date(d.created_at).toLocaleDateString('en-IN')} · Status: {d.analysis_status}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assistant?q=${encodeURIComponent(`According to my uploaded document '${d.filename}', what are the key requirements and test parameters?`)}`);
                    }}
                  >
                    <MessageSquare size={13} /> Ask in Chat
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error"
                    onClick={(e) => handleDeleteDoc(d.id, e)}
                    title="Delete document and vector chunks"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
