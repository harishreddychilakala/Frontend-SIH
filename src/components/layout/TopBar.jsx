import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Zap,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  ShieldCheck,
  FlaskConical,
  GitCompare,
  FileText,
  Layers,
  History,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import './TopBar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/standards', label: 'Standards', icon: BookOpen },
  { path: '/assistant', label: 'BIS-AI', icon: Sparkles, isAi: true },
  { path: '/compliance', label: 'Compliance', icon: ShieldCheck },
  { path: '/laboratories', label: 'Labs', icon: FlaskConical },
  { path: '/compare', label: 'Compare', icon: GitCompare },
  { path: '/documents', label: 'Documents', icon: FileText },
  { path: '/services', label: 'Services', icon: Layers },
];

export default function TopBar() {
  const { user, theme, setTheme, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/standards?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const themeOptions = [
    { value: 'dark', icon: Moon },
    { value: 'light', icon: Sun },
    { value: 'system', icon: Monitor },
  ];

  const cycleTheme = () => {
    const themes = ['dark', 'light', 'system'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
  };

  const ThemeIcon = themeOptions.find(t => t.value === theme)?.icon || Moon;

  return (
    <header className="topbar" role="banner">
      <div className="topbar__inner">
        {/* Brand */}
        <div
          className="topbar__brand"
          onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
          role="button"
          tabIndex={0}
          aria-label="Go to dashboard"
        >
          <div className="topbar__logo" aria-hidden="true">
            <Zap size={16} />
          </div>
          <div className="topbar__brand-text">
            <span className="topbar__brand-name">BIS SmartAI</span>
            <span className="topbar__brand-sub">Standards Intelligence</span>
          </div>
        </div>

        {/* Primary Desktop Navigation Bar */}
        <nav className="topbar__nav" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive: exactActive }) =>
                  `topbar__nav-link ${exactActive || isActive ? 'topbar__nav-link--active' : ''} ${item.isAi ? 'topbar__nav-link--ai' : ''}`
                }
              >
                <Icon size={15} className="topbar__nav-icon" />
                <span className="topbar__nav-label">{item.label}</span>
                {item.isAi && <span className="topbar__ai-dot" />}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Actions: Search + Theme + Profile + Mobile Toggle */}
        <div className="topbar__actions">
          {/* Search */}
          <form className="topbar__search" onSubmit={handleSearch} role="search">
            <Search className="topbar__search-icon" size={14} aria-hidden="true" />
            <input
              type="search"
              className="topbar__search-input"
              placeholder="Search standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search standards"
              id="global-search"
            />
          </form>

          {/* Theme toggle */}
          <button
            className="topbar__action btn btn-ghost btn-icon"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${theme})`}
            title={`Theme: ${theme}`}
          >
            <ThemeIcon size={16} />
          </button>

          {/* Profile dropdown */}
          <div className="topbar__profile-wrap">
            <button
              className="topbar__profile-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              id="profile-menu-btn"
            >
              <div className="topbar__avatar" aria-hidden="true">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="topbar__username">{user?.name?.split(' ')[0] || 'User'}</span>
              <ChevronDown size={12} className={`topbar__chevron ${profileOpen ? 'topbar__chevron--open' : ''}`} />
            </button>

            {profileOpen && (
              <>
                <div className="topbar__backdrop" onClick={() => setProfileOpen(false)} aria-hidden="true" />
                <div className="topbar__dropdown" role="menu" aria-labelledby="profile-menu-btn">
                  <div className="topbar__dropdown-header">
                    <span className="topbar__dropdown-name">{user?.name || 'User'}</span>
                    <span className="topbar__dropdown-email">{user?.email}</span>
                  </div>
                  <div className="topbar__dropdown-divider" />
                  <button
                    className="topbar__dropdown-item"
                    role="menuitem"
                    onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    className="topbar__dropdown-item"
                    role="menuitem"
                    onClick={() => { navigate('/history'); setProfileOpen(false); }}
                  >
                    <History size={14} /> Search History
                  </button>
                  <button
                    className="topbar__dropdown-item"
                    role="menuitem"
                    onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                  >
                    <Settings size={14} /> Settings
                  </button>
                  <div className="topbar__dropdown-divider" />
                  <button
                    className="topbar__dropdown-item topbar__dropdown-item--danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            className="topbar__mobile-toggle btn btn-ghost btn-icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Navigation */}
      {mobileMenuOpen && (
        <>
          <div className="topbar__mobile-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <nav className="topbar__mobile-menu animate-fade-in" aria-label="Mobile Navigation">
            <div className="topbar__mobile-grid">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive: exactActive }) =>
                      `topbar__mobile-link ${exactActive || isActive ? 'topbar__mobile-link--active' : ''}`
                    }
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
