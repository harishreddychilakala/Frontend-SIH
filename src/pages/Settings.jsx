import { useState } from 'react';
import { Sun, Moon, Monitor, Bell, Shield, Eye, Database, User, Key, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const settingsSections = ['Profile', 'Appearance', 'Notifications', 'AI Preferences', 'Security', 'Data & Privacy'];

export default function Settings() {
  const { theme, setTheme, user, updateUser, logout, addToast } = useApp();
  const [activeSection, setActiveSection] = useState('Profile');
  const [notifs, setNotifs] = useState({ updates: true, compliance: true, newsletter: false });
  const [aiPrefs, setAiPrefs] = useState({ structured: true, showSources: true, autoSearch: false });

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [industry, setIndustry] = useState(user?.industry || 'Manufacturing');
  const [role, setRole] = useState(user?.role || 'Quality Manager');
  const [savingProfile, setSavingProfile] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateUser({ name, organization, industry, role });
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const saveToast = () => addToast('Preferences saved successfully', 'success');

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
      <div className="page-header">
        <h1 className="page-title">Settings & Preferences</h1>
        <p className="page-subtitle">Manage your account profile, appearance, AI settings, and security.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        {/* Nav */}
        <div className="card" style={{ padding: '8px', height: 'fit-content', position: 'sticky', top: '80px' }}>
          {settingsSections.map(sec => (
            <button
              key={sec}
              className={`settings__nav-btn ${activeSection === sec ? 'settings__nav-btn--active' : ''}`}
              onClick={() => setActiveSection(sec)}
              id={`settings-nav-${sec.toLowerCase().replace(/\s/g, '-')}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '10px 12px', background: activeSection === sec ? 'rgba(59,130,246,0.1)' : 'none',
                border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                color: activeSection === sec ? 'var(--blue-light)' : 'var(--text-secondary)',
                fontSize: 'var(--text-sm)', fontWeight: activeSection === sec ? '600' : '400',
                fontFamily: 'var(--font-sans)', textAlign: 'left',
                transition: 'all var(--transition-fast)',
              }}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '24px' }}>
          {/* Profile Section */}
          {activeSection === 'Profile' && (
            <form onSubmit={handleSaveProfile} className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px' }}>Account Profile</h2>
              <p className="text-secondary text-xs mb-4">Update your user profile stored in Neon PostgreSQL.</p>
              
              <div className="form-group mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ''}
                  disabled
                  style={{ opacity: 0.7, cursor: 'not-allowed' }}
                />
                <span className="text-muted text-xs">Email cannot be changed directly.</span>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Organization / Enterprise</label>
                <input
                  type="text"
                  className="form-input"
                  value={organization}
                  onChange={e => setOrganization(e.target.value)}
                  placeholder="e.g., Bharat Manufacturing Ltd."
                />
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Primary Industry</label>
                <select
                  className="form-input form-select"
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                >
                  {['Manufacturing', 'Electronics & IT', 'Steel & Metals', 'Automotive', 'Chemicals', 'Toys & Consumer Goods', 'Other'].map(ind => (
                    <option key={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Professional Role</label>
                <select
                  className="form-input form-select"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  {['Quality Manager', 'Compliance Officer', 'Engineer / R&D', 'Laboratory Technician', 'Management Executive', 'Consultant'].map(r => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* Appearance Section */}
          {activeSection === 'Appearance' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '24px' }}>Appearance</h2>
              <div style={{ marginBottom: '24px' }}>
                <div className="form-label" style={{ marginBottom: '12px' }}>Theme Selection</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { value: 'dark', label: 'Dark Navy (Default)', icon: Moon },
                    { value: 'light', label: 'Light Theme', icon: Sun },
                  ].map(t => (
                    <button
                      key={t.value}
                      onClick={() => { setTheme(t.value); addToast(`Theme set to ${t.label}`, 'info'); }}
                      id={`theme-${t.value}`}
                      style={{
                        flex: 1, padding: '16px', background: theme === t.value ? 'rgba(59,130,246,0.1)' : 'var(--bg-elevated)',
                        border: `2px solid ${theme === t.value ? 'var(--blue)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                        color: theme === t.value ? 'var(--blue-light)' : 'var(--text-secondary)',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <t.icon size={20} />
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'Notifications' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '24px' }}>Notifications</h2>
              {[
                { key: 'updates', label: 'BIS Gazette Updates', desc: 'Alerts when new Quality Control Orders (QCOs) are notified' },
                { key: 'compliance', label: 'Compliance & Audit Reminders', desc: 'Notifications about standard validity and surveillance audits' },
                { key: 'newsletter', label: 'Technical Newsletter', desc: 'Monthly technical digest on amendments to Indian Standards' },
              ].map(n => (
                <div key={n.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{n.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{n.desc}</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notifs[n.key]}
                      onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))}
                      className="auth-checkbox"
                    />
                  </label>
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={saveToast}>Save Preferences</button>
            </div>
          )}

          {/* AI Preferences Section */}
          {activeSection === 'AI Preferences' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '24px' }}>AI Engine Preferences</h2>
              {[
                { key: 'structured', label: 'Structured Indian Standards Breakdown', desc: 'Provide structured sections: Standards, Clauses, QCO, Testing Labs, and Certification' },
                { key: 'showSources', label: 'Official BIS Portals Grounding', desc: 'Prioritize evidence links from bis.gov.in and manakonline.in' },
                { key: 'autoSearch', label: 'Strict Verification Flags', desc: 'Enforce honesty rule: flag unconfirmed items as Needs Verification' },
              ].map(p => (
                <div key={p.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '4px' }}>{p.label}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{p.desc}</div>
                  </div>
                  <input type="checkbox" checked={aiPrefs[p.key]} onChange={() => setAiPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))} className="auth-checkbox" />
                </div>
              ))}
              <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={saveToast}>Save Preferences</button>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'Security' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px' }}>Security & Authentication</h2>
              <div className="verified-badge mb-3">
                <CheckCircle size={12} /> JWT HS256 Authentication Active
              </div>
              <p className="text-secondary text-sm mb-4">
                Your session is protected with encrypted bcrypt password hashing and token-based isolation.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div className="card" style={{ padding: '16px', background: 'var(--bg-elevated)' }}>
                  <div className="font-semibold text-sm">Active Session</div>
                  <div className="text-muted text-xs mt-1">Logged in as: {user?.email}</div>
                  <div className="text-muted text-xs">User ID: {user?.id}</div>
                </div>
                <button className="btn btn-danger btn-sm" style={{ width: 'fit-content' }} onClick={logout}>
                  Sign Out of All Devices
                </button>
              </div>
            </div>
          )}

          {/* Data & Privacy Section */}
          {activeSection === 'Data & Privacy' && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '16px' }}>Data & Privacy Controls</h2>
              <p className="text-secondary text-sm mb-4">
                All saved standards, document analyses, and conversation records are isolated strictly to your account.
              </p>
              <div className="card" style={{ padding: '16px', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
                <div className="font-medium text-sm text-primary">PostgreSQL User Isolation</div>
                <p className="text-xs text-secondary mt-1">
                  Queries are filtered by your authenticated user UUID. User A cannot view User B's compliance records.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
