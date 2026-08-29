import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Trash2, ChevronRight, Search, History as HistoryIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import chatService from '../services/chatService.js';
import { useApp } from '../context/AppContext.jsx';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.jsx';

function formatRelative(ts) {
  if (!ts) return 'recently';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const groupLabels = { today: 'Today', yesterday: 'Yesterday', week: 'Previous 7 Days', older: 'Older' };

export default function History() {
  const [convs, setConvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, convId: null, title: '' });
  const { addToast } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    chatService.getConversations().then(c => {
      setConvs(c);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const promptDelete = (conv, e) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      convId: conv.id,
      title: conv.title,
    });
  };

  const confirmDelete = useCallback(async () => {
    const id = deleteModal.convId;
    if (!id) return;

    setDeleteModal({ isOpen: false, convId: null, title: '' });

    // Optimistic instant UI update
    setConvs(prev => prev.filter(c => c.id !== id));
    addToast('Conversation deleted', 'info');

    // Async backend call
    try {
      await chatService.deleteConversation(id);
    } catch (err) {
      console.warn('Failed to delete conversation on server:', err);
    }
  }, [deleteModal, addToast]);

  const filtered = convs.filter(c => !query || c.title.toLowerCase().includes(query.toLowerCase()));
  const grouped = {};
  filtered.forEach(c => {
    if (!grouped[c.category]) grouped[c.category] = [];
    grouped[c.category].push(c);
  });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="page-header">
        <h1 className="page-title">Chat History</h1>
        <p className="page-subtitle">Review and continue your past BIS-AI standards conversations.</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="search"
          className="form-input"
          style={{ paddingLeft: '40px' }}
          placeholder="Search conversations..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '64px', borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <HistoryIcon className="empty-state-icon" style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} size={32} />
          <p className="empty-state-title" style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>No conversations found</p>
          <p className="empty-state-description" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Start a new conversation with BIS-AI to explore Indian Standards and compliance.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/assistant')}>Ask BIS-AI</button>
        </div>
      ) : (
        Object.entries(groupLabels).map(([key, label]) => {
          const group = grouped[key];
          if (!group?.length) return null;
          return (
            <div key={key} style={{ marginBottom: '28px' }}>
              <div className="section-label" style={{ marginBottom: '10px' }}>{label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {group.map(conv => (
                  <div
                    key={conv.id}
                    className="card"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      padding: '12px 18px',
                      transition: 'all 0.18s ease'
                    }}
                    onClick={() => navigate(`/assistant?conv=${conv.id}`)}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      background: 'rgba(59, 130, 246, 0.12)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MessageSquare size={16} style={{ color: 'var(--blue-light)' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.preview}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{formatRelative(conv.timestamp)}</span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-icon"
                        onClick={(e) => promptDelete(conv, e)}
                        aria-label="Delete conversation"
                        title="Delete chat"
                        style={{ color: 'var(--text-muted)', padding: '6px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? It will be removed permanently from your history."
        itemTitle={deleteModal.title}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, convId: null, title: '' })}
        confirmLabel="Delete Chat"
      />
    </div>
  );
}
