import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronUp, ExternalLink, Shield, CheckCircle,
  Search, Sparkles, ArrowRight, Award, Building2, HelpCircle, Layers
} from 'lucide-react';
import servicesService, { serviceCategories } from '../services/servicesService.js';
import './Services.css';

function ServiceCard({ service }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="service-card card animate-fade-in">
      <div
        className="service-card__header"
        onClick={() => setExpanded(!expanded)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
      >
        <div className="service-card__info">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="badge badge-indigo">{service.category}</span>
            <div className="verified-badge">
              <Shield size={9} /> Official Scheme
            </div>
            <span className="text-xs text-muted">
              {service.timeframe}
            </span>
          </div>
          <h3 className="service-card__name">{service.name}</h3>
          <p className="service-card__desc text-secondary">{service.description}</p>
        </div>
        <button
          className="btn btn-ghost btn-icon service-card__toggle-btn"
          aria-label={expanded ? 'Collapse' : 'Expand'}
          onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="service-card__details animate-fade-in">
          <div className="divider my-4" />
          
          <div className="service-card__detail-grid">
            <div className="service-card__detail-box">
              <div className="section-label mb-2 flex items-center gap-1">
                <Building2 size={12} className="text-blue" /> Target Applicants
              </div>
              <p className="text-sm text-secondary" style={{ lineHeight: '1.5' }}>{service.whoNeedsIt}</p>
            </div>

            <div className="service-card__detail-box">
              <div className="section-label mb-2 flex items-center gap-1">
                <Layers size={12} className="text-blue" /> Regulated Products (Click to Explore)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.keyProducts?.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/standards?q=${encodeURIComponent(p)}`);
                    }}
                    className="badge badge-blue"
                    style={{ cursor: 'pointer', border: '1px solid rgba(59,130,246,0.3)' }}
                    title={`Search standards for ${p}`}
                  >
                    {p} →
                  </button>
                ))}
              </div>
            </div>

            <div className="service-card__detail-box" style={{ gridColumn: '1 / -1' }}>
              <div className="section-label mb-2 flex items-center gap-1">
                <Award size={12} className="text-blue" /> Official Procedure & Steps
              </div>
              <ol className="service-card__process">
                {service.process?.map((step, i) => (
                  <li key={i} className="service-card__process-step">
                    <span className="service-card__step-num">{i + 1}</span>
                    <span className="text-sm text-secondary" style={{ lineHeight: '1.5' }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="service-card__actions">
            {service.official_url && (
              <a
                href={service.official_url}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={13} /> Open {service.portal_name || 'BIS Portal'}
              </a>
            )}
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate(`/assistant?q=${encodeURIComponent(`Explain the eligibility, application process, and documentation for ${service.name}`)}`)}
            >
              <Sparkles size={13} /> Ask AI About This Scheme
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => navigate('/compliance')}
            >
              Check Product Compliance
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Services() {
  const [selectedCat, setSelectedCat] = useState('All Categories');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    servicesService.getServices(selectedCat)
      .then(data => {
        setServices(data || []);
      })
      .finally(() => setLoading(false));
  }, [selectedCat]);

  const filteredServices = services.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.whoNeedsIt.toLowerCase().includes(q) ||
      s.keyProducts?.some(p => p.toLowerCase().includes(q))
    );
  });

  return (
    <div className="services animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">BIS Services & Schemes</h1>
        <p className="page-subtitle">
          Official directory of Bureau of Indian Standards certification schemes, mandatory registration portals, and conformity assessment programs.
        </p>
        <div className="badge badge-blue" style={{ marginTop: '12px', width: 'fit-content' }}>
          <Shield size={12} />
          Official BIS e-Governance Schemes
        </div>
      </div>

      {/* AI Advisor Banner */}
      <div className="card services__advisor-banner">
        <div className="flex items-center gap-3">
          <div className="services__advisor-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary">Need Help Selecting the Right Scheme?</h3>
            <p className="text-xs text-secondary mt-0.5">
              Ask BIS SmartAI to recommend whether you need an ISI Mark (Scheme I), Compulsory Registration (Scheme II CRS), or Foreign Manufacturers Certification (FMCS).
            </p>
          </div>
        </div>
        <button
          className="btn btn-secondary btn-sm flex-shrink-0"
          onClick={() => navigate('/assistant?q=Which BIS certification scheme applies to my product and business?')}
        >
          Ask AI Advisor <ArrowRight size={13} />
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="services__controls">
        <div className="services__search-wrap">
          <Search size={16} className="services__search-icon" />
          <input
            type="search"
            className="form-input services__search-input"
            placeholder="Search schemes by name, keyword, or product (e.g., ISI Mark, CRS, Steel, Electronics)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search schemes"
          />
        </div>

        <div className="services__categories">
          {serviceCategories.map((cat) => (
            <button
              key={cat}
              className={`services__cat-btn ${selectedCat === cat ? 'services__cat-btn--active' : ''}`}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services List */}
      <div className="services__list">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="card services__skeleton-card">
              <div className="skeleton" style={{ height: '24px', width: '30%', marginBottom: '10px' }} />
              <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '14px' }} />
              <div className="skeleton" style={{ height: '40px' }} />
            </div>
          ))
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">
            <Search className="empty-state-icon" />
            <p className="empty-state-title">No schemes matching &quot;{searchQuery}&quot;</p>
            <p className="empty-state-description">Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          filteredServices.map(s => <ServiceCard key={s.id} service={s} />)
        )}
      </div>
    </div>
  );
}
