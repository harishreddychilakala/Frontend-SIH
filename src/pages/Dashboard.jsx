import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, BookOpen, ShieldCheck, FlaskConical,
  Send, Sparkles, Bookmark, Clock,
  ArrowRight, CheckCircle, FileText,
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import chatService from '../services/chatService.js';
import savedService from '../services/savedService.js';
import complianceService from '../services/complianceService.js';
import HoverFooter from '../components/ui/hover-footer.jsx';
import './Dashboard.css';

const QUICK_PROMPTS = [
  { label: 'QCO requirements for steel', query: 'What are the mandatory QCO requirements for steel TMT bars under IS 1786?' },
  { label: 'Is BIS certification required?', query: 'Is BIS certification mandatory for my product?' },
  { label: 'Find applicable Indian Standard', query: 'Help me find the applicable Indian Standard for my product.' },
  { label: 'Testing requirements', query: 'What are the testing requirements under BIS standards?' },
];

const QUICK_ACTIONS = [
  {
    id: 'qa-assistant',
    icon: MessageSquare,
    title: 'Ask AI',
    desc: 'Get instant answers on Indian Standards',
    to: '/assistant',
    accent: 'blue',
  },
  {
    id: 'qa-standards',
    icon: BookOpen,
    title: 'Explore Standards',
    desc: 'Search the full BIS standards database',
    to: '/standards',
    accent: 'indigo',
  },
  {
    id: 'qa-compliance',
    icon: ShieldCheck,
    title: 'Check Compliance',
    desc: 'Run a product compliance audit',
    to: '/compliance',
    accent: 'cyan',
  },
  {
    id: 'qa-labs',
    icon: FlaskConical,
    title: 'Find Laboratory',
    desc: 'Locate NABL-accredited testing labs',
    to: '/laboratories',
    accent: 'emerald',
  },
];

const ACTIVITY_ICONS = {
  'ai-query': MessageSquare,
  'saved': Bookmark,
  'compliance-check': ShieldCheck,
};

function formatRelative(ts) {
  if (!ts) return 'recently';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [stats, setStats] = useState({
    savedStandards: 0,
    complianceChecks: 0,
    aiConversations: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [convs, saved, reports] = await Promise.allSettled([
          chatService.getConversations(),
          savedService.getSavedStandards(),
          complianceService.getComplianceReports(),
        ]);

        const convList = convs.status === 'fulfilled' ? convs.value : [];
        const savedList = saved.status === 'fulfilled' ? saved.value : [];
        const reportList = reports.status === 'fulfilled' ? reports.value : [];

        setStats({
          savedStandards: savedList.length,
          complianceChecks: reportList.length,
          aiConversations: convList.length,
        });

        const acts = [];
        convList.slice(0, 3).forEach(c => {
          acts.push({
            id: `act-conv-${c.id}`,
            type: 'ai-query',
            title: c.title || 'AI Conversation',
            description: 'AI Standards Conversation',
            timestamp: c.timestamp,
            link: '/assistant',
          });
        });
        savedList.slice(0, 2).forEach(s => {
          acts.push({
            id: `act-saved-${s.id}`,
            type: 'saved',
            title: s.standard_reference || 'Standard',
            description: s.title || 'Saved Standard',
            timestamp: s.created_at,
            link: '/saved',
          });
        });
        reportList.slice(0, 2).forEach(r => {
          acts.push({
            id: `act-comp-${r.id}`,
            type: 'compliance-check',
            title: r.product_name || 'Compliance Audit',
            description: `Score: ${r.overall_score ?? '—'}% · ${r.status ?? ''}`,
            timestamp: r.created_at,
            link: '/compliance',
          });
        });

        acts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setRecentActivities(acts.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleAsk = (q) => {
    const prompt = q || query;
    if (prompt.trim()) {
      navigate(`/assistant?q=${encodeURIComponent(prompt.trim())}`);
    } else {
      navigate('/assistant');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) handleAsk(query);
  };

  return (
    <div className="db animate-fade-in">

      {/* ── Page header ── */}
      <div className="db__header">
        <div>
          <h1 className="db__title">Dashboard</h1>
          <p className="db__subtitle">BIS SmartAI · Standards Intelligence</p>
        </div>
      </div>

      {/* ── AI Search ── */}
      <div className="db__search-card">
        <div className="db__search-row">
          <div className="db__search-icon-wrap" aria-hidden="true">
            <Sparkles size={18} className="db__sparkle" />
          </div>
          <input
            id="dashboard-ai-search"
            type="text"
            className="db__search-input"
            placeholder="Ask BIS SmartAI about standards, QCOs, certification, testing..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Ask BIS SmartAI"
          />
          <button
            className="btn btn-primary db__search-btn"
            onClick={() => handleAsk(query)}
            id="dashboard-ask-btn"
          >
            <Send size={14} />
            <span>Ask SmartAI</span>
          </button>
        </div>

        <div className="db__chips-row" role="list" aria-label="Quick prompts">
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              role="listitem"
              className="db__chip"
              onClick={() => handleAsk(p.query)}
              title={p.query}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="db__metrics-grid">
        {/* Standards — static, intentional */}
        <div
          className="db__metric-card db__metric-card--blue"
          onClick={() => navigate('/standards')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/standards')}
          aria-label="Indian Standards database"
          id="metric-standards"
        >
          <div className="db__metric-icon-wrap db__metric-icon-wrap--blue">
            <BookOpen size={16} />
          </div>
          <div className="db__metric-value">20,000+</div>
          <div className="db__metric-label">Indian Standards</div>
        </div>

        {/* Saved — dynamic */}
        <div
          className="db__metric-card db__metric-card--indigo"
          onClick={() => navigate('/saved')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/saved')}
          aria-label="Saved standards"
          id="metric-saved"
        >
          <div className="db__metric-icon-wrap db__metric-icon-wrap--indigo">
            <Bookmark size={16} />
          </div>
          <div className="db__metric-value">
            {loading ? <span className="db__metric-skeleton" /> : stats.savedStandards}
          </div>
          <div className="db__metric-label">Saved Standards</div>
        </div>

        {/* Compliance — dynamic */}
        <div
          className="db__metric-card db__metric-card--cyan"
          onClick={() => navigate('/compliance')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/compliance')}
          aria-label="Compliance checks"
          id="metric-compliance"
        >
          <div className="db__metric-icon-wrap db__metric-icon-wrap--cyan">
            <ShieldCheck size={16} />
          </div>
          <div className="db__metric-value">
            {loading ? <span className="db__metric-skeleton" /> : stats.complianceChecks}
          </div>
          <div className="db__metric-label">Compliance Checks</div>
        </div>

        {/* AI Consultations — dynamic */}
        <div
          className="db__metric-card db__metric-card--emerald"
          onClick={() => navigate('/assistant')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/assistant')}
          aria-label="AI consultations"
          id="metric-ai"
        >
          <div className="db__metric-icon-wrap db__metric-icon-wrap--emerald">
            <MessageSquare size={16} />
          </div>
          <div className="db__metric-value">
            {loading ? <span className="db__metric-skeleton" /> : stats.aiConversations}
          </div>
          <div className="db__metric-label">AI Consultations</div>
        </div>
      </div>

      {/* ── Two-column: Activity + Quick Actions ── */}
      <div className="db__columns">

        {/* Recent Activity */}
        <section className="db__activity-card" aria-labelledby="activity-heading">
          <div className="db__section-header">
            <h2 className="db__section-title" id="activity-heading">
              <Clock size={15} className="db__section-icon" />
              Recent Activity
            </h2>
            <button
              className="db__see-all-btn"
              onClick={() => navigate('/history')}
              id="activity-see-all"
            >
              See all <ArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <div className="db__activity-list">
              {[1, 2, 3].map(i => (
                <div key={i} className="db__activity-item db__activity-item--skeleton">
                  <div className="db__activity-skel-icon" />
                  <div className="db__activity-skel-text">
                    <div className="db__activity-skel-line db__activity-skel-line--wide" />
                    <div className="db__activity-skel-line db__activity-skel-line--narrow" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities.length === 0 ? (
            <div className="db__empty-state">
              <FileText size={28} className="db__empty-icon" />
              <p className="db__empty-title">No recent activity</p>
              <p className="db__empty-desc">
                Your AI conversations, saved standards, and compliance checks will appear here.
              </p>
            </div>
          ) : (
            <ul className="db__activity-list" role="list">
              {recentActivities.map(act => {
                const Icon = ACTIVITY_ICONS[act.type] || CheckCircle;
                return (
                  <li key={act.id}>
                    <button
                      className="db__activity-item"
                      onClick={() => navigate(act.link)}
                      title={act.title}
                    >
                      <div className={`db__activity-icon-wrap db__activity-icon-wrap--${act.type}`}>
                        <Icon size={14} />
                      </div>
                      <div className="db__activity-text">
                        <span className="db__activity-title">{act.title}</span>
                        <span className="db__activity-desc">{act.description}</span>
                      </div>
                      <span className="db__activity-time">
                        {formatRelative(act.timestamp)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Quick Actions */}
        <section className="db__actions-card" aria-labelledby="actions-heading">
          <div className="db__section-header">
            <h2 className="db__section-title" id="actions-heading">Quick Actions</h2>
          </div>

          <div className="db__actions-list">
            {QUICK_ACTIONS.map(action => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  id={action.id}
                  className={`db__action-item db__action-item--${action.accent}`}
                  onClick={() => navigate(action.to)}
                >
                  <div className={`db__action-icon db__action-icon--${action.accent}`}>
                    <Icon size={16} />
                  </div>
                  <div className="db__action-text">
                    <span className="db__action-title">{action.title}</span>
                    <span className="db__action-desc">{action.desc}</span>
                  </div>
                  <ArrowRight size={14} className="db__action-arrow" />
                </button>
              );
            })}
          </div>
        </section>

      </div>

      {/* Footer */}
      <HoverFooter />
    </div>
  );
}
