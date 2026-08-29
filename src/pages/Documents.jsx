import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertTriangle, X, Shield } from 'lucide-react';
import documentService from '../services/documentService.js';
import { useApp } from '../context/AppContext.jsx';
import './Documents.css';

export default function Documents() {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState('idle'); // idle | uploading | analyzing | done
  const [result, setResult] = useState(null);
  const [pastDocs, setPastDocs] = useState([]);
  const fileRef = useRef();
  const { addToast } = useApp();

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
    setStage('uploading');
    addToast('Document uploading to backend...', 'info');

    try {
      setTimeout(() => setStage('analyzing'), 800);
      const analysis = await documentService.analyzeDocument(f);
      setResult(analysis);
      setStage('done');
      addToast('Document analyzed and stored in PostgreSQL', 'success');
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

  const reset = () => { setFile(null); setStage('idle'); setResult(null); };

  const extractedRequirements = result?.extracted_requirements || result?.extractedRequirements || [];
  const complianceGaps = result?.compliance_gaps || result?.complianceGaps || [];
  const referencedStandards = result?.referenced_standards || result?.referencedStandards || [];
  const uploadTime = result?.uploaded_at || result?.uploadedAt || new Date().toISOString();
  const fileSize = result?.file_size || result?.fileSize || '2.4 MB';

  return (
    <div className="documents animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Document Analysis</h1>
        <p className="page-subtitle">Upload product specifications or standard draft documents for AI requirement extraction.</p>
        <div className="badge badge-blue" style={{ marginTop: '12px', width: 'fit-content' }}>
          <Shield size={12} />
          FastAPI & PostgreSQL Document Processing
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
          aria-label="Upload document for analysis"
          onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
          id="document-upload-zone"
        >
          <input ref={fileRef} type="file" accept=".pdf,.docx,.doc,.png,.jpg,.jpeg" hidden onChange={e => handleFile(e.target.files[0])} />
          <Upload size={40} className="documents__drop-icon" />
          <h3>Drop your technical document here</h3>
          <p>or click to browse files</p>
          <div className="documents__file-types">
            <span className="badge badge-muted">PDF</span>
            <span className="badge badge-muted">DOCX</span>
            <span className="badge badge-muted">Images</span>
          </div>
          <p className="documents__drop-limit">Maximum file size: 10MB</p>
        </div>
      )}

      {(stage === 'uploading' || stage === 'analyzing') && (
        <div className="documents__progress card animate-fade-in">
          <div className="compliance__loading-orb"><div className="compliance__spinner" /></div>
          <h3>{stage === 'uploading' ? 'Uploading document...' : 'Extracting BIS requirements with AI...'}</h3>
          <p className="text-secondary">{file?.name}</p>
          <div className="progress-bar" style={{ width: '300px' }}>
            <div className="progress-fill" style={{ width: stage === 'uploading' ? '40%' : '85%', transition: 'width 1.5s ease' }} />
          </div>
          <p className="text-muted text-xs">{stage === 'analyzing' ? 'Identifying applicable standards and compliance parameters...' : 'Please wait...'}</p>
        </div>
      )}

      {stage === 'done' && result && (
        <div className="documents__result animate-fade-in">
          <div className="documents__result-header card">
            <div className="flex items-center gap-3">
              <div className="documents__file-icon"><FileText size={20} /></div>
              <div>
                <div className="font-semibold">{result.filename || file?.name}</div>
                <div className="text-muted text-xs">{fileSize} · Analyzed {new Date(uploadTime).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset}><X size={14} /> Analyze Another</button>
          </div>

          <div className="documents__result-grid">
            {/* Summary */}
            <div className="card">
              <h3 className="documents__section-title">Document Summary</h3>
              <p className="text-secondary text-sm" style={{ lineHeight: '1.7' }}>{result.summary}</p>
            </div>

            {/* Requirements */}
            <div className="card">
              <h3 className="documents__section-title">Extracted Requirements</h3>
              <div className="documents__req-list">
                {extractedRequirements.map((req, i) => (
                  <div key={i} className="documents__req-item">
                    <span className="badge badge-indigo">{req.category || 'Specification'}</span>
                    <span className="text-sm">{req.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance Gaps */}
            <div className="card">
              <h3 className="documents__section-title">Compliance Gaps</h3>
              <div className="documents__gap-list">
                {complianceGaps.map((gap, i) => (
                  <div key={i} className={`documents__gap-item documents__gap-item--${gap.severity || 'medium'}`}>
                    <AlertTriangle size={14} />
                    <span className="text-sm">{gap.issue}</span>
                    <span className="badge badge-muted" style={{ marginLeft: 'auto' }}>{gap.severity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referenced Standards */}
            <div className="card">
              <h3 className="documents__section-title">Referenced Standards</h3>
              <div className="documents__standards-list">
                {referencedStandards.map((std, i) => (
                  <div key={i} className="documents__std-item">
                    <span className="standards__std-number">{std.number}</span>
                    <span className="verified-badge"><Shield size={9} /> Verified Standard</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
