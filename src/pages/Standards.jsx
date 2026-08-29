import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Bookmark, BookmarkCheck, ChevronRight, SlidersHorizontal,
  Sparkles, Shield, AlertTriangle, ArrowRight, Layers, X, BookOpen,
  Filter
} from 'lucide-react';
import standardsService from '../services/standardsService.js';
import { standardCategories, standardStatuses } from '../data/standards.js';
import { useApp } from '../context/AppContext.jsx';
import './Standards.css';

const POPULAR_TOPICS = [
  'All',
  'Water Heaters',
  'TMT Steel Bars',
  'Protective Helmets',
  'Portland Cement',
  'Plugs & Sockets',
  'IT Equipment',
  'Toys',
  'LED Drivers',
  'Solar Modules',
];

export default function Standards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [standards, setStandards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All Status');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { toggleSaveStandard, isStandardSaved, addToast } = useApp();
  const navigate = useNavigate();

  const search = async (searchQuery = query) => {
    setLoading(true);
    try {
      const { results } = await standardsService.searchStandards({ query: searchQuery, category, status });
      setStandards(results || []);
    } catch {
      addToast('Failed to load standards', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [category, status]);

  const handleSearch = (e) => {
    e.preventDefault();
    search(query);
  };

  const handlePopularTopic = (topic) => {
    if (topic === 'All') {
      setQuery('');
      search('');
    } else {
      setQuery(topic);
      search(topic);
    }
  };

  const hasActiveFilters = category !== 'All Categories' || status !== 'All Status' || query.trim() !== '';

  const resetFilters = () => {
    setCategory('All Categories');
    setStatus('All Status');
    setQuery('');
    search('');
  };

  return (
    <div className="standards-page animate-fade-in">
      {/* ── Header ── */}
      <div className="standards__header">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="badge badge-blue text-xs">
            <Sparkles size={11} className="text-blue" /> BIS Standards Intelligence
          </span>
          <span className="badge badge-muted text-xs">20,000+ Indexed Records</span>
        </div>
        <h1 className="page-title">Explore Indian Standards</h1>
        <p className="page-subtitle">
          Search and discover authentic BIS Indian Standards (IS) for products and industries with regulatory scope, testing clauses, and mandatory QCO requirements.
        </p>
      </div>

      {/* ── Sleek AI Search Bar ── */}
      <div className="card standards__search-card">
        <form onSubmit={handleSearch} className="standards__search-form">
          <div className="standards__search-input-wrap">
            <Search size={16} className="standards__search-icon" />
            <input
              type="search"
              className="standards__search-input"
              placeholder="Search by IS number (e.g. IS 2082, IS 1786), product keyword, or industry..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search standards"
              id="standards-search"
            />
            {query && (
              <button
                type="button"
                className="standards__search-clear-btn"
                onClick={() => { setQuery(''); search(''); }}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <button type="submit" className="btn btn-primary standards__search-submit-btn" id="standards-search-btn">
            <span>Search</span>
          </button>

          <button
            type="button"
            className={`btn btn-secondary standards__filter-btn ${filtersOpen ? 'standards__filter-btn--active' : ''}`}
            onClick={() => setFiltersOpen(!filtersOpen)}
            aria-expanded={filtersOpen}
            id="standards-filter-toggle"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
            {(category !== 'All Categories' || status !== 'All Status') && (
              <span className="standards__filter-dot" />
            )}
          </button>
        </form>

        {/* Expandable Filter Drawer */}
        {filtersOpen && (
          <div className="standards__filters-drawer animate-fade-in">
            <div className="standards__filters-grid">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input form-select"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  id="filter-category"
                >
                  {standardCategories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-input form-select"
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  id="filter-status"
                >
                  {standardStatuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="standards__filters-footer">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={resetFilters}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Popular Topics (Clean No-Scrollbar Chips) ── */}
      <div className="standards__popular-bar">
        <span className="standards__popular-label">Popular:</span>
        <div className="standards__popular-chips">
          {POPULAR_TOPICS.map((topic) => {
            const isActive = (topic === 'All' && !query) || query === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => handlePopularTopic(topic)}
                className={`standards__popular-chip ${isActive ? 'standards__popular-chip--active' : ''}`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Meta Bar ── */}
      <div className="standards__meta-bar">
        <div className="text-xs text-secondary font-medium">
          {loading ? (
            'Searching Indian Standards database…'
          ) : (
            <>
              Showing <strong className="text-primary">{standards.length}</strong> Indian Standards
              {query && <span> for &ldquo;<span className="text-blue">{query}</span>&rdquo;</span>}
            </>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="standards__clear-filters-link"
            onClick={resetFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* ── Standards List ── */}
      <div className="standards__list">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card standards__skeleton-card">
              <div className="skeleton" style={{ height: '22px', width: '30%', marginBottom: '12px' }} />
              <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '14px' }} />
              <div className="skeleton" style={{ height: '40px', marginBottom: '16px' }} />
              <div className="skeleton" style={{ height: '32px', width: '100%' }} />
            </div>
          ))
        ) : standards.length === 0 ? (
          <div className="card empty-state" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <Search className="empty-state-icon" style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} size={32} />
            <p className="empty-state-title" style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>
              No standards found for &ldquo;{query}&rdquo;
            </p>
            <p className="empty-state-description" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Try searching by IS number, generic product name, or ask BIS-AI directly.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(`What Indian Standard and QCO applies to ${query}?`)}`)}
            >
              <Sparkles size={14} /> Ask BIS-AI About &ldquo;{query}&rdquo;
            </button>
          </div>
        ) : (
          standards.map((standard) => {
            const saved = isStandardSaved(standard.id);
            return (
              <div key={standard.id} className="standard-card card animate-fade-in">
                {/* Top Badge Row & Bookmark Action */}
                <div className="standard-card__top">
                  <div className="standard-card__badges">
                    <span className="standards__std-number">{standard.number}</span>
                    <span className={`badge ${standard.status === 'Active' ? 'badge-success' : 'badge-muted'} text-xs`}>
                      {standard.status}
                    </span>
                    <span className="badge badge-indigo text-xs">{standard.category}</span>
                    {standard.qcoApplicable && (
                      <span className="badge badge-warning text-xs">QCO Mandatory</span>
                    )}
                    <div className="verified-badge text-xs">
                      <Shield size={10} /> Verified Standard
                    </div>
                  </div>

                  <button
                    className={`standard-card__save-btn btn btn-ghost btn-icon ${saved ? 'standard-card__save-btn--saved' : ''}`}
                    onClick={() => toggleSaveStandard(standard)}
                    title={saved ? 'Remove from saved' : 'Save standard to bookmarks'}
                    aria-label={saved ? 'Remove from saved' : 'Save standard to bookmarks'}
                  >
                    {saved ? (
                      <BookmarkCheck size={18} style={{ color: 'var(--blue-light)' }} />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </button>
                </div>

                {/* Title */}
                <h2
                  className="standard-card__title"
                  onClick={() => navigate(`/standards/${encodeURIComponent(standard.id)}`)}
                >
                  {standard.title}
                </h2>

                {/* Scope Description */}
                <p className="standard-card__scope">
                  {standard.scope}
                </p>

                {/* Footer Metadata & Action Buttons */}
                <div className="standard-card__footer">
                  <div className="standard-card__meta">
                    <span className="text-xs text-muted">Last Updated: {standard.lastUpdated}</span>
                    {standard.bisMarkRequired && (
                      <span className="text-xs text-muted">• Mandatory Standard Mark</span>
                    )}
                  </div>

                  <div className="standard-card__actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain technical requirements, testing clauses, and QCO for ${standard.number} (${standard.title})`)}`)}
                    >
                      <Sparkles size={13} className="text-blue" /> Ask BIS-AI
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/standards/${encodeURIComponent(standard.id)}`)}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
