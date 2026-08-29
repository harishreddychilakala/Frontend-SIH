import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Zap, Search, Shield, FileText, FlaskConical,
  ChevronRight, Star, CheckCircle, ExternalLink, Sparkles,
  Award, Layers, GitCompare, Building, ArrowUpRight, Cpu, Play
} from 'lucide-react';
import HoverFooter from '../components/ui/hover-footer.jsx';
import { CoverflowCarousel } from '../components/ui/CoverflowCarousel.jsx';
import { HeroParallax, BIS_PRODUCTS } from '../components/ui/hero-parallax.jsx';
import '../components/ui/hero-parallax.css';
import './Landing.css';

const CAPABILITIES = [
  {
    icon: Search,
    title: 'Indian Standards Intelligence',
    description: 'Instant AI discovery across 20,000+ Indian Standards (IS), identifying applicable testing clauses and regulatory requirements.',
    color: 'blue',
    link: '/standards',
  },
  {
    icon: Shield,
    title: 'Instant QCO Compliance Audit',
    description: 'Evaluate if your product falls under mandatory Quality Control Orders (QCO) with gap analysis and certification steps.',
    color: 'indigo',
    link: '/compliance',
  },
  {
    icon: GitCompare,
    title: 'Side-by-Side Comparator',
    description: 'Compare technical scopes, testing clauses, and certification parameters between multiple Indian Standards in real time.',
    color: 'cyan',
    link: '/compare',
  },
  {
    icon: FlaskConical,
    title: 'NABL Testing Labs Directory',
    description: 'Locate BIS-recognized apex testing facilities and NABL-accredited (ISO/IEC 17025) laboratories for sample testing.',
    color: 'emerald',
    link: '/laboratories',
  },
];

const STATS_DATA = [
  { value: '20,000+', label: 'Indian Standards Indexed', icon: Layers },
  { value: '100+', label: 'Mandatory QCOs Tracked', icon: Shield },
  { value: '50+', label: 'NABL & Apex Testing Labs', icon: Building },
  { value: 'Gemini 3.6', label: 'AI Intelligence Engine', icon: Sparkles },
];

// BIS-relevant product categories — all Unsplash images (used in Coverflow below hero)
const BIS_SLIDES = [
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Industrial steel manufacturing plant with TMT bars',
    title: 'IS 1786 — TMT Steel Bars',
    subtitle: 'QCO Mandatory · BIS Scheme I',
    meta: [
      { label: 'Standard', value: 'IS 1786:2008' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'LED lighting products — bulbs and strip lights',
    title: 'IS 16102 — LED Lamps & Luminaires',
    subtitle: 'CRS Mandatory · BIS Scheme II',
    meta: [
      { label: 'Standard', value: 'IS 16102' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme II (CRS)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Lithium-ion battery pack for electric vehicles',
    title: 'IS 16046 — Lithium-Ion Batteries',
    subtitle: 'Safety Testing · BIS Mandatory',
    meta: [
      { label: 'Standard', value: 'IS 16046' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme II (CRS)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Electric kettle on a kitchen counter',
    title: 'IS 302-2-15 — Electric Kettles',
    subtitle: 'ISI Mark Mandatory · Household',
    meta: [
      { label: 'Standard', value: 'IS 302-2-15' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Engineer inspecting electronics circuit board in factory',
    title: 'IS 13252 — IT Equipment Safety',
    subtitle: 'CRS Mandatory · Electronics',
    meta: [
      { label: 'Standard', value: 'IS 13252-1' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme II (CRS)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Cement bags stacked at a construction material depot',
    title: 'IS 269 — Ordinary Portland Cement',
    subtitle: 'ISI Mark Mandatory · Construction',
    meta: [
      { label: 'Standard', value: 'IS 269' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Medical devices and healthcare equipment for safety testing',
    title: 'IS 13450 — Medical Devices',
    subtitle: 'BIS Mandatory · CDSCO Aligned',
    meta: [
      { label: 'Standard', value: 'IS 13450' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1548946526-f69e2424cf45?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Clean drinking water treatment and purification facility',
    title: 'IS 7387 — Water Purifier Components',
    subtitle: 'IS 10500 · Water Quality Standards',
    meta: [
      { label: 'Standard', value: 'IS 7387' },
      { label: 'QCO Status', value: 'Voluntary' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Electrical wires and power cable insulation manufacturing',
    title: 'IS 694 — PVC Insulated Cables',
    subtitle: 'ISI Mark Mandatory · Electrical',
    meta: [
      { label: 'Standard', value: 'IS 694' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
  {
    src: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=640&h=640&fit=crop&q=80&auto=format',
    alt: 'Smart home electronics and IoT device setup',
    title: 'IS 616 — Power Transformers',
    subtitle: 'QCO Enforced · Energy Sector',
    meta: [
      { label: 'Standard', value: 'IS 616' },
      { label: 'QCO Status', value: 'Mandatory' },
      { label: 'Scheme', value: 'Scheme I (ISI Mark)' },
    ],
  },
];

export default function Landing() {
  const [heroSearch, setHeroSearch] = useState('');
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/assistant');
    }
  };

  return (
    <div className="landing">
      {/* Top Floating Navbar */}
      <header className="landing__navbar">
        <div className="container landing__nav-content">
          <Link to="/" className="landing__nav-logo">
            <div className="landing__nav-logo-icon">
              <Shield size={20} />
            </div>
            <span className="landing__nav-brand">
              BIS <span className="text-[#38BDF8]">SmartAI</span>
            </span>
          </Link>

          <nav className="landing__nav-links">
            <Link to="/standards">Standards Explorer</Link>
            <Link to="/compliance">Compliance Checker</Link>
            <Link to="/compare">Compare</Link>
            <Link to="/services">BIS Schemes</Link>
            <Link to="/laboratories">Testing Labs</Link>
          </nav>

          <div className="landing__nav-actions">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Launch App <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          HERO — Scroll-driven Parallax (replaces old hero)
          ═══════════════════════════════════════════════════════ */}
      <HeroParallax
        products={BIS_PRODUCTS}
        heroSearch={heroSearch}
        setHeroSearch={setHeroSearch}
        onSubmit={handleHeroSearch}
      />

      {/* Live Stats Row */}
      <section className="landing__stats-section">
        <div className="container">
          <div className="landing__stats-grid">
            {STATS_DATA.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="landing__stat-card card">
                  <div className="landing__stat-icon">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="landing__stat-number">{stat.value}</div>
                    <div className="landing__stat-label">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coverflow Showcase — BIS Product Categories */}
      <section className="landing__section landing__showcase-section">
        <div className="container">
          <div className="landing__section-header text-center">
            <div className="section-label mb-2">Certified Product Intelligence</div>
            <h2 className="landing__section-title">Explore India's Most Regulated Product Categories</h2>
            <p className="landing__section-subtitle">
              From TMT steel bars and LED lamps to lithium batteries and medical devices — BIS SmartAI covers every mandatory ISI & CRS category.
            </p>
          </div>

          <CoverflowCarousel
            slides={BIS_SLIDES}
            cardWidth="clamp(180px, 24vw, 300px)"
            rotate={46}
            depth={0.55}
            fade={0.12}
            showCaption={true}
            showPagination={true}
            showNavigation={true}
            loop={true}
            label="BIS Regulated Product Categories"
          />

          <div className="landing__showcase-cta">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/standards')}
            >
              Browse All 20,000+ Indian Standards <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="landing__section">
        <div className="container">
          <div className="landing__section-header text-center">
            <div className="section-label mb-2">Comprehensive Intelligence Suite</div>
            <h2 className="landing__section-title">Everything Needed for Regulatory Compliance</h2>
            <p className="landing__section-subtitle">
              From identifying the applicable Indian Standard to locating accredited testing facilities and filing applications.
            </p>
          </div>

          <div className="landing__capabilities-grid">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <div
                  key={i}
                  className={`landing__cap-card card card-hover landing__cap-card--${cap.color}`}
                  onClick={() => navigate(cap.link)}
                >
                  <div className={`landing__cap-icon-box landing__cap-icon-box--${cap.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="landing__cap-title">{cap.title}</h3>
                  <p className="landing__cap-desc">{cap.description}</p>
                  <div className="landing__cap-action">
                    <span>Explore Feature</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Certification Journey */}
      <section className="landing__section landing__section--alt">
        <div className="container">
          <div className="landing__section-header text-center">
            <div className="section-label mb-2">Standard Operating Procedure</div>
            <h2 className="landing__section-title">The 4-Step BIS Certification Roadmap</h2>
            <p className="landing__section-subtitle">
              How manufacturers, importers, and startups navigate from initial specification to licence grant.
            </p>
          </div>

          <div className="landing__workflow-grid">
            {[
              { step: '01', title: 'Find Indian Standard', desc: 'Identify exact IS number, title, and mandatory QCO enforcement order.' },
              { step: '02', title: 'Audit Compliance', desc: 'Verify factory testing readiness, product specs, and documentation checklist.' },
              { step: '03', title: 'Sample Testing', desc: 'Conduct test runs at NABL-accredited & BIS-recognized testing houses.' },
              { step: '04', title: 'Apply on Manakonline', desc: 'Submit application for Scheme I (ISI Mark) or Scheme II (CRS) grant.' },
            ].map((step, i) => (
              <div key={i} className="landing__workflow-card card">
                <div className="landing__workflow-step">{step.step}</div>
                <h3 className="landing__workflow-title">{step.title}</h3>
                <p className="landing__workflow-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Footer */}
      <div className="container">
        <HoverFooter />
      </div>
    </div>
  );
}