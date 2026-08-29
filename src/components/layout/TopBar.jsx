import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Monitor, User, Settings, LogOut, ChevronDown, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import './TopBar.css';

export default function TopBar() {
  const { user, theme, setTheme, logout } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/standards?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    setProfileOpen(false);
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
      {/* Brand */}
      <div className="topbar__brand" onClick={() => navigate('/dashboard')} role="button" tabIndex={0} aria-label="Go to dashboard">
        <div className="topbar__logo" aria-hidden="true">
          <Zap size={16} />
        </div>
        <div className="topbar__brand-text">
          <span className="topbar__brand-name">BIS SmartAI</span>
          <span className="topbar__brand-sub">Standards Intelligence</span>
        </div>
      </div>

      {/* Search */}
      <form className="topbar__search" onSubmit={handleSearch} role="search">
        <Search className="topbar__search-icon" size={15} aria-hidden="true" />
        <input
          type="search"
          className="topbar__search-input"
          placeholder="Search standards, products, BIS services..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          aria-label="Search standards and BIS services"
          id="global-search"
        />
      </form>

      {/* Actions */}
      <div className="topbar__actions">
        {/* Notifications */}
        <button className="topbar__action btn btn-ghost btn-icon" aria-label="Notifications" title="Notifications">
          <Bell size={17} />
          <span className="topbar__notif-dot" aria-hidden="true" />
        </button>

        {/* Theme toggle */}
        <button
          className="topbar__action btn btn-ghost btn-icon"
          onClick={cycleTheme}
          aria-label={`Switch theme (current: ${theme})`}
          title={`Theme: ${theme}`}
        >
          <ThemeIcon size={17} />
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
            <ChevronDown size={13} className={`topbar__chevron ${profileOpen ? 'topbar__chevron--open' : ''}`} />
          </button>

          {profileOpen && (
            <>
              <div className="topbar__backdrop" onClick={() => setProfileOpen(false)} aria-hidden="true" />
              <div className="topbar__dropdown" role="menu" aria-labelledby="profile-menu-btn">
                <div className="topbar__dropdown-header">
                  <span className="topbar__dropdown-name">{user?.name}</span>
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
      </div>
    </header>
  );
}
