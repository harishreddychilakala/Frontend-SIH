import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, BookOpen, GitCompare,
  ShieldCheck, Building2, FlaskConical, FileText, Bookmark,
  History, Settings, HelpCircle, ChevronLeft, ChevronRight,
  LogOut, User, Zap, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import './Sidebar.css';

const navSections = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/assistant', icon: MessageSquare, label: 'AI Assistant' },
      { to: '/standards', icon: BookOpen, label: 'Standards Explorer' },
      { to: '/compare', icon: GitCompare, label: 'Compare Standards' },
    ],
  },
  {
    label: 'Compliance',
    items: [
      { to: '/compliance', icon: ShieldCheck, label: 'Compliance Checker' },
      { to: '/services', icon: Building2, label: 'BIS Services' },
      { to: '/laboratories', icon: FlaskConical, label: 'Laboratories' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/documents', icon: FileText, label: 'Documents' },
      { to: '/saved', icon: Bookmark, label: 'Saved Standards' },
      { to: '/history', icon: History, label: 'Chat History' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar() {
  const { user, sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''} ${mobileSidebarOpen ? 'sidebar--mobile-open' : ''}`}
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="sidebar__header">
          <div className="sidebar__brand">
            <div className="sidebar__logo">
              <Zap size={18} />
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar__brand-text">
                <span className="sidebar__brand-name">BIS SmartAI</span>
                <span className="sidebar__brand-sub">Standards Intelligence</span>
              </div>
            )}
          </div>

          {/* Collapse toggle (desktop) */}
          <button
            className="sidebar__collapse-btn btn btn-ghost btn-icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close */}
          <button
            className="sidebar__mobile-close btn btn-ghost btn-icon"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav" aria-label="Application navigation">
          {navSections.map((section) => (
            <div key={section.label} className="sidebar__section">
              {!sidebarCollapsed && (
                <span className="sidebar__section-label section-label">
                  {section.label}
                </span>
              )}
              <ul className="sidebar__items" role="list">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                      }
                      title={sidebarCollapsed ? item.label : undefined}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      <item.icon size={18} className="sidebar__item-icon" />
                      {!sidebarCollapsed && (
                        <span className="sidebar__item-label">{item.label}</span>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar__footer">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `sidebar__user ${isActive ? 'sidebar__user--active' : ''}`
            }
            title={sidebarCollapsed ? user?.name : undefined}
            onClick={() => setMobileSidebarOpen(false)}
          >
            <div className="sidebar__avatar" aria-hidden="true">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar__user-info">
                <span className="sidebar__user-name truncate">{user?.name || 'User'}</span>
                <span className="sidebar__user-email truncate">{user?.email || ''}</span>
              </div>
            )}
          </NavLink>

          <button
            className="sidebar__logout btn btn-ghost btn-icon"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
