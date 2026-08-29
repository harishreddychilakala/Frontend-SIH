import { useState } from 'react';
import { User, Mail, Building2, Briefcase, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Profile() {
  const { user, updateUser, addToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
    industry: user?.industry || '',
    role: user?.role || '',
  });
  const [saving, setSaving] = useState(false);

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser(form);
      setEditing(false);
      addToast('Profile updated successfully', 'success');
    } catch {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { label: 'Full Name', key: 'name', icon: User, type: 'text' },
    { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
    { label: 'Organization', key: 'organization', icon: Building2, type: 'text' },
    { label: 'Industry', key: 'industry', icon: Briefcase, type: 'text' },
    { label: 'Role', key: 'role', icon: Briefcase, type: 'text' },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px' }}>
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your account information.</p>
      </div>

      {/* Avatar */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px', padding: '24px' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gradient-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: '800', flexShrink: 0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color: 'var(--text-primary)' }}>{user?.name}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{user?.email}</div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px' }}>
            {user?.role} · {user?.organization}
          </div>
        </div>
        {!editing && (
          <button className="btn btn-secondary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setEditing(true)}>
            <Edit3 size={14} /> Edit Profile
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {fields.map(field => (
            <div key={field.key} className="form-group">
              <label className="form-label" htmlFor={`profile-${field.key}`}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <field.icon size={13} /> {field.label}
                </span>
              </label>
              {editing ? (
                <input
                  id={`profile-${field.key}`}
                  type={field.type}
                  className="form-input"
                  value={form[field.key]}
                  onChange={set(field.key)}
                />
              ) : (
                <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                  {user?.[field.key] || '—'}
                </div>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
            <button className="btn btn-secondary" onClick={() => setEditing(false)} disabled={saving}>
              <X size={14} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      <div className="demo-notice" style={{ marginTop: '16px' }}>Demo — Profile data is stored locally in Phase 1.</div>
    </div>
  );
}
