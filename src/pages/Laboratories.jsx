import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, FlaskConical, CheckCircle, Shield,
  Phone, Mail, Sparkles, ArrowRight, ExternalLink, Building, Layers
} from 'lucide-react';
import laboratoryService, { labStates, labTestingTypes } from '../services/laboratoryService.js';
import './Laboratories.css';

const QUICK_TESTING_CHIPS = [
  'All Types',
  'Electrical',
  'Mechanical',
  'Chemical',
  'Electronics',
  'Civil',
  'Food & Beverages',
];

export default function Laboratories() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [state, setState] = useState('All States');
  const [testingType, setTestingType] = useState('All Types');
  const navigate = useNavigate();

  const search = async (searchQuery = query, searchState = state, searchType = testingType) => {
    setLoading(true);
    try {
      const results = await laboratoryService.searchLaboratories({
        query: searchQuery,
        state: searchState,
        testingType: searchType,
      });
      setLabs(results || []);
    } catch (err) {
      console.error('Failed to load laboratories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(query, state, testingType);
  }, [state, testingType]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    search(query, state, testingType);
  };

  const handleQuickChip = (type) => {
    setTestingType(type);
    search(query, state, type);
  };

  return (
    <div className="labs animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Testing Laboratories</h1>
        <p className="page-subtitle">
          Official directory of BIS Central, Regional, and NABL-accredited testing facilities for conformity assessment and regulatory sample testing.
        </p>
        <div className="badge badge-blue" style={{ marginTop: '12px', width: 'fit-content' }}>
          <Shield size={12} />
          Directory of Recognized Testing Facilities & NABL Accredited Centers
        </div>
      </div>

      {/* AI Advisor Banner */}
      <div className="card labs__advisor-banner">
        <div className="flex items-center gap-3">
          <div className="labs__advisor-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">Need Help Finding a Recognized Lab for Your Product?</h3>
            <p className="text-xs text-secondary mt-0.5">
              Ask BIS SmartAI to identify the exact testing facilities accredited under your product&apos;s Indian Standard (IS clauses) and location.
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm flex-shrink-0"
          onClick={() => navigate('/assistant?q=Find me BIS recognized testing laboratories for my product with testing capabilities and address')}
        >
          Find with AI <ArrowRight size={13} />
        </button>
      </div>

      {/* Modern Search & Filter Toolbar */}
      <div className="card labs__toolbar-card">
        <form onSubmit={handleSearchSubmit} className="labs__toolbar-form">
          <div className="labs__search-input-wrap">
            <Search size={16} className="labs__search-icon" />
            <input
              type="search"
              className="form-input labs__search-input"
              placeholder="Search by product, capability, standard number (e.g. IS 302), or lab name..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search laboratories"
            />
          </div>

          <div className="labs__filter-group">
            <select
              className="form-input form-select labs__select"
              value={state}
              onChange={e => setState(e.target.value)}
              aria-label="Filter by State"
            >
              {labStates.map(s => <option key={s}>{s}</option>)}
            </select>

            <select
              className="form-input form-select labs__select"
              value={testingType}
              onChange={e => setTestingType(e.target.value)}
              aria-label="Filter by Testing Category"
            >
              {labTestingTypes.map(t => <option key={t}>{t}</option>)}
            </select>

            <button type="submit" className="btn btn-primary labs__search-btn" id="labs-search-btn">
              Search
            </button>
          </div>
        </form>

        {/* Quick Testing Chips */}
        <div className="labs__quick-chips">
          <span className="text-xs text-muted flex items-center">Filter:</span>
          {QUICK_TESTING_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`labs__chip ${testingType === chip ? 'labs__chip--active' : ''}`}
              onClick={() => handleQuickChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="labs__results-meta">
        <span className="text-xs text-secondary font-medium">
          {loading ? 'Searching testing laboratories & NABL index...' : `Showing ${labs.length} verified laboratories`}
        </span>
      </div>

      {/* Grid of Laboratory Cards */}
      <div className="labs__grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card labs__skeleton-card">
              <div className="skeleton" style={{ height: '22px', width: '40%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '26px', width: '80%', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '70px', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '36px' }} />
            </div>
          ))
        ) : labs.length === 0 ? (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <FlaskConical className="empty-state-icon" />
            <p className="empty-state-title">No testing laboratories found for &quot;{query}&quot;</p>
            <p className="empty-state-description">Try adjusting your location filter or search terms.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '14px' }}
              onClick={() => { setQuery(''); setState('All States'); setTestingType('All Types'); search('', 'All States', 'All Types'); }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          labs.map((lab) => (
            <div key={lab.id} className="lab-card card animate-fade-in">
              <div className="lab-card__header">
                <div className="lab-card__header-badges">
                  <span className="badge badge-indigo text-xs">{lab.type}</span>
                  <div className="verified-badge">
                    <CheckCircle size={10} /> Verified NABL / BIS
                  </div>
                </div>
                <h3 className="lab-card__name">{lab.name}</h3>
                <div className="lab-card__location">
                  <MapPin size={13} className="text-blue flex-shrink-0 mt-0.5" />
                  <span>{lab.address || `${lab.city}, ${lab.state}`}</span>
                </div>
              </div>

              <div className="lab-card__body">
                <div className="lab-card__section">
                  <div className="section-label mb-1.5 flex items-center gap-1">
                    <FlaskConical size={11} className="text-blue" /> Testing Capabilities
                  </div>
                  <div className="lab-card__tag-list">
                    {lab.testingTypes?.map((t) => (
                      <span key={t} className="badge badge-muted text-xs">{t}</span>
                    ))}
                  </div>
                </div>

                <div className="lab-card__section">
                  <div className="section-label mb-1.5 flex items-center gap-1">
                    <Layers size={11} className="text-blue" /> Covered Standards (Click to View)
                  </div>
                  <div className="lab-card__tag-list">
                    {lab.standards?.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => navigate(`/standards?q=${encodeURIComponent(s)}`)}
                        className="standards__std-number text-xs"
                        style={{ cursor: 'pointer', border: '1px solid rgba(6,182,212,0.3)' }}
                        title={`Search ${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lab-card__section">
                  <div className="section-label mb-1">Accreditation Status</div>
                  <p className="text-xs text-secondary" style={{ lineHeight: '1.4' }}>{lab.accreditation}</p>
                </div>
              </div>

              <div className="lab-card__footer">
                {lab.contact && (
                  <div className="lab-card__contact text-xs text-muted mb-3 flex items-center gap-1.5">
                    <Phone size={12} className="text-blue flex-shrink-0" />
                    <span style={{ wordBreak: 'break-all' }}>{lab.contact}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm w-full"
                    onClick={() => navigate(`/assistant?q=${encodeURIComponent(`What tests can be performed at ${lab.name} and how do I submit test samples?`)}`)}
                  >
                    <Sparkles size={12} /> Ask AI About Testing
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
