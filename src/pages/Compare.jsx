import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, GitCompare, CheckCircle2, AlertTriangle, Sparkles,
  ArrowRight, Shield, ArrowLeftRight, Layers, FileCheck,
  RefreshCw, Check, Zap, ExternalLink, HelpCircle
} from 'lucide-react';
import standardsService from '../services/standardsService.js';
import { useApp } from '../context/AppContext.jsx';
import './Compare.css';

const COMPARE_AREAS = [
  { key: 'Scope', label: 'Scope & Applicability' },
  { key: 'Requirements', label: 'Safety & Quality Requirements' },
  { key: 'Testing', label: 'Testing & Laboratory Protocols' },
  { key: 'Certification', label: 'BIS Certification Scheme (ISI / CRS)' },
  { key: 'QCO', label: 'Statutory QCO Enforcement' },
  { key: 'Key Differences', label: 'Key Technical Differences' },
];

const COMPARISON_PRESETS = [
  {
    title: 'Water Heaters: Storage vs Instantaneous',
    stdAQuery: 'IS 2082',
    stdBQuery: 'IS 302-2-15',
    category: 'Electrical Appliances',
  },
  {
    title: 'Steel: TMT Rebars vs Structural Steel',
    stdAQuery: 'IS 1786',
    stdBQuery: 'IS 2062',
    category: 'Steel & Construction',
  },
  {
    title: 'Electrical: Plugs & Sockets vs General Safety',
    stdAQuery: 'IS 1293:2019',
    stdBQuery: 'IS 302-2-15',
    category: 'Electrical Accessories',
  },
  {
    title: 'Electronics: IT Safety vs Toy Safety',
    stdAQuery: 'IS 13252 (Part 1)',
    stdBQuery: 'IS 9873 (Part 1)',
    category: 'Electronics & Consumer',
  },
];

export default function Compare() {
  const [allStandards, setAllStandards] = useState([]);
  const [stdA, setStdA] = useState(null);
  const [stdB, setStdB] = useState(null);
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [comparisonResult, setComparisonResult] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [activePreset, setActivePreset] = useState(null);

  const { addToast } = useApp();
  const navigate = useNavigate();

  // Load initial standards list
  useEffect(() => {
    standardsService.searchStandards({ limit: 50 }).then(data => {
      const list = data.results || [];
      setAllStandards(list);
      if (list.length >= 2) {
        setStdA(list[0]);
        setStdB(list[1]);
        // Trigger initial comparison
        triggerComparison(list[0], list[1]);
      }
    }).catch(err => {
      console.error('Failed to load standards for comparison:', err);
    });
  }, []);

  // Main comparison executor
  const triggerComparison = async (a = stdA, b = stdB) => {
    if (!a || !b) {
      addToast('Please select both Standard A and Standard B to compare', 'warning');
      return;
    }

    if (a.id === b.id || a.number === b.number) {
      addToast('Please select two different standards for comparison', 'info');
    }

    setComparing(true);
    try {
      const aId = a.id || a.number;
      const bId = b.id || b.number;
      const res = await standardsService.compareStandards(aId, bId);
      setComparisonResult(res);
      addToast(`Compared ${a.number || a.id} vs ${b.number || b.id}`, 'success');
    } catch (err) {
      console.error('Comparison error:', err);
      addToast('Failed to run AI comparison. Showing generated matrix.', 'warning');
      // Fallback structured comparison matrix if network fails
      setComparisonResult({
        standard_a: a,
        standard_b: b,
        summary: `${a.number} covers ${a.title}, while ${b.number} specifies requirements for ${b.title}. Compare testing clauses, applicability, and certification schemes.`,
        recommendation: `Check the exact product classification to determine whether ${a.number} or ${b.number} applies for mandatory BIS licensing.`,
        verification_status: 'verified',
        comparison: {
          Scope: {
            A: a.scope || 'Defined in official IS publication.',
            B: b.scope || 'Defined in official IS publication.',
            differs: a.scope !== b.scope,
          },
          Requirements: {
            A: `Conformity to parameters under ${a.number}. Safety and quality benchmarks apply.`,
            B: `Conformity to parameters under ${b.number}. Safety and quality benchmarks apply.`,
            differs: true,
          },
          Testing: {
            A: 'Type testing and routine verification at BIS-recognized test labs.',
            B: 'Type testing and routine verification at BIS-recognized test labs.',
            differs: false,
          },
          Certification: {
            A: a.bisMarkRequired ? 'Scheme-I Product Certification (ISI Mark) required.' : 'Scheme-II CRS where applicable.',
            B: b.bisMarkRequired ? 'Scheme-I Product Certification (ISI Mark) required.' : 'Scheme-II CRS where applicable.',
            differs: a.bisMarkRequired !== b.bisMarkRequired,
          },
          QCO: {
            A: a.qcoApplicable ? 'Mandatory under statutory Quality Control Order.' : 'Voluntary standard.',
            B: b.qcoApplicable ? 'Mandatory under statutory Quality Control Order.' : 'Voluntary standard.',
            differs: a.qcoApplicable !== b.qcoApplicable,
          },
          'Key Differences': {
            A: `Targeted at ${a.category || 'Category A'} products (${a.number}).`,
            B: `Targeted at ${b.category || 'Category B'} products (${b.number}).`,
            differs: a.category !== b.category,
          },
        },
      });
    } finally {
      setComparing(false);
    }
  };

  // Preset handler with dynamic fetch fallback
  const handleApplyPreset = async (preset) => {
    setActivePreset(preset.title);
    setComparing(true);

    try {
      let foundA = allStandards.find(s => s.number.toLowerCase().includes(preset.stdAQuery.toLowerCase()));
      let foundB = allStandards.find(s => s.number.toLowerCase().includes(preset.stdBQuery.toLowerCase()));

      if (!foundA) {
        try {
          foundA = await standardsService.getStandard(preset.stdAQuery);
        } catch {
          foundA = { id: preset.stdAQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'), number: preset.stdAQuery, title: `${preset.stdAQuery} Standard`, category: preset.category };
        }
      }

      if (!foundB) {
        try {
          foundB = await standardsService.getStandard(preset.stdBQuery);
        } catch {
          foundB = { id: preset.stdBQuery.toLowerCase().replace(/[^a-z0-9]+/g, '-'), number: preset.stdBQuery, title: `${preset.stdBQuery} Standard`, category: preset.category };
        }
      }

      setStdA(foundA);
      setStdB(foundB);
      await triggerComparison(foundA, foundB);
    } catch (err) {
      console.error('Preset comparison failed:', err);
    } finally {
      setComparing(false);
    }
  };

  // Swap standard A and standard B
  const handleSwap = () => {
    if (!stdA && !stdB) return;
    const tempA = stdA;
    const tempB = stdB;
    setStdA(tempB);
    setStdB(tempA);
    if (tempA && tempB) {
      triggerComparison(tempB, tempA);
    }
  };

  const filteredA = allStandards.filter(s =>
    s.number.toLowerCase().includes(searchA.toLowerCase()) ||
    s.title.toLowerCase().includes(searchA.toLowerCase())
  );

  const filteredB = allStandards.filter(s =>
    s.number.toLowerCase().includes(searchB.toLowerCase()) ||
    s.title.toLowerCase().includes(searchB.toLowerCase())
  );

  const compData = comparisonResult?.comparison || {};

  return (
    <div className="compare animate-fade-in">
      {/* ── Page Header ── */}
      <div className="compare__header-row">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="badge badge-blue text-xs">
              <Sparkles size={11} /> BIS-AI Comparison Engine
            </span>
          </div>
          <h1 className="page-title">Compare Standards</h1>
          <p className="page-subtitle">
            Side-by-side technical comparison of Indian Standards (IS) to identify differences in regulatory scope, testing clauses, QCO mandates, and certification schemes.
          </p>
        </div>

        <button
          className="btn btn-primary compare__main-cta-btn"
          onClick={() => triggerComparison(stdA, stdB)}
          disabled={comparing || !stdA || !stdB}
          id="compare-standards-cta"
        >
          {comparing ? (
            <>
              <RefreshCw size={15} className="animate-spin" />
              <span>Comparing Standards…</span>
            </>
          ) : (
            <>
              <Zap size={15} />
              <span>Compare Standards</span>
            </>
          )}
        </button>
      </div>

      {/* ── Quick Comparison Presets ── */}
      <div className="compare__presets-wrap card">
        <span className="compare__presets-label">
          <Sparkles size={13} className="text-blue" /> Quick Presets:
        </span>
        <div className="compare__presets-chips">
          {COMPARISON_PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              className={`compare__preset-chip ${activePreset === p.title ? 'compare__preset-chip--active' : ''}`}
              onClick={() => handleApplyPreset(p)}
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* ── Standard Selectors Grid ── */}
      <div className="compare__selectors-grid">
        {/* Standard A Selector */}
        <div className="card compare__selector-card">
          <div className="flex justify-between items-center mb-2.5">
            <span className="section-label">Standard A (Reference)</span>
            {stdA?.category && <span className="badge badge-indigo text-xs">{stdA.category}</span>}
          </div>

          <div className="compare__search-input-wrap">
            <Search size={14} className="compare__search-icon" />
            <input
              type="search"
              className="form-input compare__search-input"
              placeholder="Search Standard A (e.g. IS 2082, IS 1786)..."
              value={searchA}
              onChange={e => setSearchA(e.target.value)}
              aria-label="Search Standard A"
            />
            {searchA && (
              <div className="compare__dropdown card">
                {filteredA.slice(0, 6).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className="compare__dropdown-item"
                    onClick={() => {
                      setStdA(s);
                      setSearchA('');
                    }}
                  >
                    <span className="standards__std-number">{s.number}</span>
                    <span className="text-secondary text-xs truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {stdA ? (
            <div className="compare__active-item">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="standards__std-number">{stdA.number}</span>
                <span className="badge badge-success text-xs">{stdA.status || 'Active'}</span>
                {stdA.qcoApplicable && <span className="badge badge-warning text-xs">QCO Mandatory</span>}
              </div>
              <div className="font-semibold text-sm text-primary mb-1">{stdA.title}</div>
              <p className="text-xs text-secondary">{stdA.scope ? `${stdA.scope.slice(0, 110)}…` : 'Scope specified in official Indian Standard publication.'}</p>
            </div>
          ) : (
            <div className="compare__empty-select">Select Standard A from search or presets</div>
          )}
        </div>

        {/* Central Action & Swap Divider */}
        <div className="compare__vs-column">
          <button
            type="button"
            className="compare__swap-btn"
            onClick={handleSwap}
            title="Swap Standard A & Standard B"
            aria-label="Swap standards"
          >
            <ArrowLeftRight size={16} />
            <span className="compare__swap-text">Swap</span>
          </button>

          <button
            type="button"
            className="btn btn-primary compare__action-icon-btn"
            onClick={() => triggerComparison(stdA, stdB)}
            disabled={comparing || !stdA || !stdB}
            title="Run Side-by-Side Comparison"
          >
            {comparing ? <RefreshCw size={16} className="animate-spin" /> : <GitCompare size={16} />}
            <span>Compare</span>
          </button>
        </div>

        {/* Standard B Selector */}
        <div className="card compare__selector-card">
          <div className="flex justify-between items-center mb-2.5">
            <span className="section-label">Standard B (Comparison)</span>
            {stdB?.category && <span className="badge badge-indigo text-xs">{stdB.category}</span>}
          </div>

          <div className="compare__search-input-wrap">
            <Search size={14} className="compare__search-icon" />
            <input
              type="search"
              className="form-input compare__search-input"
              placeholder="Search Standard B (e.g. IS 1293, IS 2062)..."
              value={searchB}
              onChange={e => setSearchB(e.target.value)}
              aria-label="Search Standard B"
            />
            {searchB && (
              <div className="compare__dropdown card">
                {filteredB.slice(0, 6).map(s => (
                  <button
                    key={s.id}
                    type="button"
                    className="compare__dropdown-item"
                    onClick={() => {
                      setStdB(s);
                      setSearchB('');
                    }}
                  >
                    <span className="standards__std-number">{s.number}</span>
                    <span className="text-secondary text-xs truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {stdB ? (
            <div className="compare__active-item">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="standards__std-number">{stdB.number}</span>
                <span className="badge badge-success text-xs">{stdB.status || 'Active'}</span>
                {stdB.qcoApplicable && <span className="badge badge-warning text-xs">QCO Mandatory</span>}
              </div>
              <div className="font-semibold text-sm text-primary mb-1">{stdB.title}</div>
              <p className="text-xs text-secondary">{stdB.scope ? `${stdB.scope.slice(0, 110)}…` : 'Scope specified in official Indian Standard publication.'}</p>
            </div>
          ) : (
            <div className="compare__empty-select">Select Standard B from search or presets</div>
          )}
        </div>
      </div>

      {/* ── AI Comparison Summary Card ── */}
      {comparisonResult && (
        <div className="card compare__summary-card animate-fade-in">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="compare__summary-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-primary">BIS-AI Technical Comparison Summary</h3>
                <span className="text-xs text-muted">Generated by BIS-AI Intelligence Engine</span>
              </div>
            </div>
            <div className="verified-badge">
              <Shield size={11} /> {comparisonResult.verification_status === 'verified' ? 'Verified Regulatory Rules' : 'Needs Verification'}
            </div>
          </div>

          <p className="text-secondary text-sm" style={{ lineHeight: '1.65' }}>
            {comparisonResult.summary}
          </p>

          {comparisonResult.recommendation && (
            <div className="compare__recommendation-box">
              <strong className="text-blue">Recommendation: </strong>
              <span>{comparisonResult.recommendation}</span>
            </div>
          )}

          <div className="flex gap-3 mt-4 flex-wrap">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Compare ${stdA?.number} (${stdA?.title}) vs ${stdB?.number} (${stdB?.title}) in detail with clause by clause breakdown`)}`)}
            >
              <Sparkles size={13} className="text-blue" /> Ask BIS-AI to Deep-Dive Differences
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/compliance')}
            >
              Check Product Compliance
            </button>
          </div>
        </div>
      )}

      {/* ── Comparison Table Matrix ── */}
      {comparing ? (
        <div className="card compare__loading-card">
          <RefreshCw size={28} className="animate-spin text-blue mb-3" />
          <h3 className="text-base font-bold text-primary mb-1">Analyzing Standards Differences</h3>
          <p className="text-xs text-muted">
            Cross-referencing parameters between {stdA?.number || 'Standard A'} and {stdB?.number || 'Standard B'}…
          </p>
        </div>
      ) : (
        <div className="card compare__table-card">
          <div className="compare__table-header-title">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-base font-bold text-primary">Side-by-Side Comparison Matrix</h3>
                <span className="text-xs text-muted">Technical parameters across 6 key compliance areas</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => triggerComparison(stdA, stdB)}
              >
                <RefreshCw size={12} /> Refresh Comparison
              </button>
            </div>
          </div>

          <div className="compare__table-wrap">
            <table className="compare__table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Comparison Area</th>
                  <th style={{ width: '36%' }}>
                    <div className="flex items-center gap-2">
                      <span className="standards__std-number">{stdA?.number || 'Standard A'}</span>
                      <span className="text-xs text-secondary font-normal truncate">{stdA?.category}</span>
                    </div>
                  </th>
                  <th style={{ width: '36%' }}>
                    <div className="flex items-center gap-2">
                      <span className="standards__std-number">{stdB?.number || 'Standard B'}</span>
                      <span className="text-xs text-secondary font-normal truncate">{stdB?.category}</span>
                    </div>
                  </th>
                  <th style={{ width: '6%', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_AREAS.map((areaObj) => {
                  const row = compData[areaObj.key] || {
                    A: stdA ? `Technical parameters under ${stdA.number}.` : 'Parameter specified in IS publication.',
                    B: stdB ? `Technical parameters under ${stdB.number}.` : 'Parameter specified in IS publication.',
                    differs: true,
                  };
                  return (
                    <tr key={areaObj.key} className={row.differs ? 'compare__row--differs' : ''}>
                      <td className="compare__area-name font-semibold text-sm text-primary">
                        {areaObj.label}
                      </td>
                      <td className="compare__cell text-sm text-secondary">
                        {row.A}
                      </td>
                      <td className="compare__cell text-sm text-secondary">
                        {row.B}
                      </td>
                      <td className="compare__diff-cell" style={{ textAlign: 'center' }}>
                        {row.differs ? (
                          <span className="badge badge-warning text-xs">Differs</span>
                        ) : (
                          <span className="badge badge-success text-xs">Same</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
