import { useState, useEffect } from 'react';
import { Search, BookmarkX, ChevronRight, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import savedService from '../services/savedService.js';
import { useApp } from '../context/AppContext.jsx';

export default function Saved() {
  const [saved, setSaved] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToast } = useApp();
  const navigate = useNavigate();

  const loadSaved = async () => {
    try {
      setLoading(true);
      const items = await savedService.getSavedStandards();
      setSaved(items);
    } catch (err) {
      console.error('Failed to load saved standards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await savedService.deleteSavedStandard(id);
      setSaved(prev => prev.filter(s => s.id !== id && s.standard_reference !== id));
      addToast('Standard removed from saved', 'info');
    } catch (err) {
      addToast('Failed to remove saved standard', 'error');
    }
  };

  const filtered = saved.filter(s =>
    !query ||
    s.standard_reference?.toLowerCase().includes(query.toLowerCase()) ||
    s.title?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div className="page-header">
        <h1 className="page-title">Saved Standards</h1>
        <p className="page-subtitle">Your bookmarked Indian Standards stored in Neon PostgreSQL.</p>
      </div>

      {saved.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div className="standards__search-input-wrap">
            <Search size={16} className="standards__search-icon" />
            <input
              type="search"
              className="form-input"
              style={{ paddingLeft: 'calc(var(--space-3) + 16px + var(--space-2))' }}
              placeholder="Search saved standards..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search saved standards"
            />
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px' }} />)}
        </div>
      ) : saved.length === 0 ? (
        <div className="empty-state">
          <Bookmark className="empty-state-icon" />
          <p className="empty-state-title">No saved standards</p>
          <p className="empty-state-description">Save standards from the Standards Explorer for quick access here.</p>
          <button className="btn btn-primary" onClick={() => navigate('/standards')}>
            Explore Standards
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Search className="empty-state-icon" />
          <p className="empty-state-title">No matching standards found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(std => (
            <div key={std.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`/standards/${std.standard_reference || std.id}`)}>
                <div className="standards__std-number">{std.standard_reference}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginTop: '4px', marginBottom: '8px' }}>{std.title}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className={`badge ${std.status === 'Active' ? 'badge-success' : 'badge-muted'}`}>{std.status || 'Active'}</span>
                  {std.category && <span className="badge badge-indigo">{std.category}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-icon-sm" onClick={(e) => handleDelete(std.id, e)} aria-label="Remove from saved">
                  <BookmarkX size={16} style={{ color: 'var(--error)' }} />
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/standards/${std.standard_reference || std.id}`)}>
                  <ChevronRight size={14} /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
