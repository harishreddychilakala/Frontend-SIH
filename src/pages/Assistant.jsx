import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Search, Plus, Trash2, MessageSquare,
  User as UserIcon, ChevronRight, Shield, ExternalLink,
  Bot, X, Clock, Sparkles, Command, FileText, FlaskConical,
  Scale, Layers, ArrowUp, Loader2, CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import AIOrb from '../components/ai/AIOrb.jsx';
import BISThinking from '../components/ai/BISThinking.jsx';
import AIResponse from '../components/ai/AIResponse.jsx';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal.jsx';
import chatService from '../services/chatService.js';
import './Assistant.css';

const COMMAND_SUGGESTIONS = [
  {
    prefix: '/qco',
    label: 'QCO Mandates',
    description: 'Check statutory Quality Control Orders',
    prompt: 'What are the mandatory Quality Control Order (QCO) requirements and compliance deadlines for: ',
    icon: Shield,
  },
  {
    prefix: '/standard',
    label: 'Find Standard',
    description: 'Lookup Indian Standard (IS) number & scope',
    prompt: 'What official Indian Standard (IS number) applies to: ',
    icon: FileText,
  },
  {
    prefix: '/testing',
    label: 'Testing Clauses',
    description: 'Laboratory safety and performance tests',
    prompt: 'What are the mandatory laboratory testing clauses and acceptance criteria for: ',
    icon: FlaskConical,
  },
  {
    prefix: '/certify',
    label: 'Certification Scheme',
    description: 'Scheme I (ISI) vs Scheme II (CRS) process',
    prompt: 'Explain the BIS certification scheme (ISI Mark vs CRS) and licensing procedure for: ',
    icon: Scale,
  },
  {
    prefix: '/compare',
    label: 'Compare Standards',
    description: 'Compare two Indian Standards side-by-side',
    prompt: 'Compare the following two Indian Standards in detail: ',
    icon: Layers,
  },
];

const SUGGESTED_PROMPTS = [
  { icon: '⚡', label: 'Electric Kettles (IS 302-2-15)', query: 'Which BIS standard and testing clauses apply to electric kettles?' },
  { icon: '🏗️', label: 'Steel TMT Rebars QCO', query: 'What are the mandatory QCO requirements for steel TMT bars under IS 1786?' },
  { icon: '📜', label: 'Scheme I vs Scheme II CRS', query: 'Explain the difference between BIS Scheme I (ISI Mark) and Scheme II (CRS).' },
  { icon: '🔋', label: 'Lithium Battery Safety', query: 'What are the safety and drop test requirements for lithium batteries under IS 16046?' },
];

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function TypingDots() {
  return (
    <span className="bis-ai-dots" aria-hidden="true">
      {[1, 2, 3].map((dot) => (
        <motion.span
          key={dot}
          className="bis-ai-dot"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: dot * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

export default function Assistant() {
  const [searchParams] = useSearchParams();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [searching, setSearching] = useState('');
  const [loadingConvId, setLoadingConvId] = useState(null);

  // Command palette state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [attachments, setAttachments] = useState([]);
  const commandPaletteRef = useRef(null);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, convId: null, title: '' });

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const convCacheRef = useRef({});
  const abortRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Auto-resize textarea
  const adjustHeight = useCallback((reset = false) => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (reset) {
      ta.style.height = '48px';
      return;
    }
    ta.style.height = '48px';
    const newHeight = Math.min(ta.scrollHeight, 160);
    ta.style.height = `${Math.max(48, newHeight)}px`;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Load conversations on mount
  const loadConversations = useCallback(async (silent = false) => {
    if (!silent) setLoadingHistory(true);
    try {
      const convs = await chatService.getConversations();
      setConversations(convs);
      return convs;
    } catch (err) {
      if (!silent) console.error('Failed to load conversations:', err);
      return [];
    } finally {
      if (!silent) setLoadingHistory(false);
    }
  }, []);

  // Initial load + query params
  useEffect(() => {
    loadConversations().then((convs) => {
      const q = searchParams.get('q');
      const convParam = searchParams.get('conv');
      if (convParam) {
        selectConversation(convParam);
      } else if (q) {
        setInput(q);
        setTimeout(() => handleSend(q), 50);
      } else if (convs.length > 0) {
        selectConversation(convs[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Command palette detection
  useEffect(() => {
    if (input.startsWith('/') && !input.includes(' ')) {
      setShowCommandPalette(true);
      const matchIdx = COMMAND_SUGGESTIONS.findIndex(cmd => cmd.prefix.startsWith(input));
      setActiveSuggestion(matchIdx >= 0 ? matchIdx : 0);
    } else {
      setShowCommandPalette(false);
    }
  }, [input]);

  // Click outside to close command palette
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commandPaletteRef.current && !commandPaletteRef.current.contains(e.target)) {
        setShowCommandPalette(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectConversation = useCallback(async (id) => {
    if (loadingConvId === id) return;

    if (convCacheRef.current[id]) {
      setActiveConvId(id);
      setMessages(convCacheRef.current[id]);
      return;
    }

    setActiveConvId(id);
    setLoadingConvId(id);
    setMessages([]);

    try {
      const conv = await chatService.getConversation(id);
      const msgs = conv.messages || [];
      convCacheRef.current[id] = msgs;
      setMessages(msgs);
    } catch (err) {
      addToast('Failed to load conversation', 'error');
    } finally {
      setLoadingConvId(null);
    }
  }, [loadingConvId, addToast]);

  const createConversation = useCallback(() => {
    if (loading) return;
    setActiveConvId(null);
    setMessages([]);
    setInput('');
    adjustHeight(true);
    textareaRef.current?.focus();
  }, [loading, adjustHeight]);

  // Prompt delete dialog
  const promptDeleteConversation = (conv, e) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteModal({
      isOpen: true,
      convId: conv.id,
      title: conv.title,
    });
  };

  // Perform instant optimistic deletion
  const confirmDeleteConversation = useCallback(async () => {
    const id = deleteModal.convId;
    if (!id) return;

    setDeleteModal({ isOpen: false, convId: null, title: '' });

    // 1. Instant optimistic UI update
    delete convCacheRef.current[id];
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
    addToast('Conversation deleted', 'info');

    // 2. Background async network deletion
    try {
      await chatService.deleteConversation(id);
    } catch (err) {
      console.warn('Background delete sync failed, reloading list:', err);
      loadConversations(true);
    }
  }, [deleteModal, activeConvId, addToast, loadConversations]);

  const selectCommand = (cmd) => {
    setInput(cmd.prompt);
    setShowCommandPalette(false);
    adjustHeight();
    textareaRef.current?.focus();
  };

  const handleSend = useCallback(async (overrideInput) => {
    const text = (overrideInput !== undefined ? overrideInput : input).trim();
    if (!text || loading) return;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    setInput('');
    setShowCommandPalette(false);
    adjustHeight(true);
    setLoading(true);

    const tempId = `temp-user-${Date.now()}`;
    const tempUserMsg = {
      id: tempId,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempUserMsg]);

    try {
      let finalMessages;

      if (!activeConvId) {
        const conv = await chatService.createConversation(text);
        finalMessages = conv.messages || [];
        setConversations(prev => [
          {
            id: conv.id,
            title: conv.title,
            preview: text,
            timestamp: conv.timestamp,
            category: 'today',
          },
          ...prev.filter(c => c.id !== conv.id),
        ]);
        setActiveConvId(conv.id);
        convCacheRef.current[conv.id] = finalMessages;
        setMessages(finalMessages);
      } else {
        const aiMsg = await chatService.sendMessage(activeConvId, text);
        setMessages(prev => {
          const withoutTemp = prev.filter(m => m.id !== tempId);
          const confirmedUser = { ...tempUserMsg, id: `user-confirmed-${Date.now()}` };
          const updated = [...withoutTemp, confirmedUser, aiMsg];
          convCacheRef.current[activeConvId] = updated;
          return updated;
        });
        loadConversations(true);
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      const errMsg = err.message || 'Failed to get BIS-AI response.';
      addToast(errMsg, 'error');
      setMessages(prev => [
        ...prev.filter(m => m.id !== tempId),
        tempUserMsg,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ ${errMsg} Please try again.`,
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [input, loading, activeConvId, addToast, loadConversations, adjustHeight]);

  const handleKeyDown = (e) => {
    if (showCommandPalette) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev < COMMAND_SUGGESTIONS.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestion(prev => (prev > 0 ? prev - 1 : COMMAND_SUGGESTIONS.length - 1));
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestion >= 0) {
          selectCommand(COMMAND_SUGGESTIONS[activeSuggestion]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowCommandPalette(false);
      }
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAttachFile = () => {
    navigate('/documents');
  };

  // Filter conversations
  const filteredConvs = searching
    ? conversations.filter(c => c.title.toLowerCase().includes(searching.toLowerCase()))
    : conversations;

  const grouped = {
    Today: filteredConvs.filter(c => c.category === 'today'),
    Yesterday: filteredConvs.filter(c => c.category === 'yesterday'),
    'Last 7 Days': filteredConvs.filter(c => c.category === 'week'),
    Older: filteredConvs.filter(c => c.category === 'older'),
  };

  const activeSources = messages
    .filter(m => m.role === 'assistant' && m.structured && m.answer?.sources?.length)
    .slice(-1)[0]?.answer?.sources || [];

  return (
    <div className="assistant assistant--black">
      {/* Background Ambient Pulses */}
      <div className="assistant__bg-mesh" aria-hidden="true">
        <div className="assistant__bg-glow assistant__bg-glow--1" />
        <div className="assistant__bg-glow assistant__bg-glow--2" />
      </div>

      {/* ── LEFT: Conversation Sidebar ── */}
      <aside className="assistant__sidebar" aria-label="Conversations">
        <div className="assistant__sidebar-header">
          <button
            className="btn btn-primary w-full assistant__new-btn"
            onClick={createConversation}
            id="new-conversation"
            disabled={loading}
          >
            <Plus size={15} /> New Conversation
          </button>
          <div className="assistant__search">
            <Search size={13} className="assistant__search-icon" />
            <input
              type="search"
              placeholder="Search conversations…"
              className="form-input assistant__search-input"
              value={searching}
              onChange={e => setSearching(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
        </div>

        <div className="assistant__conv-list" role="list">
          {loadingHistory ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="assistant__conv-skeleton">
                <div className="skeleton" style={{ width: '75%', height: 12, borderRadius: 6 }} />
                <div className="skeleton" style={{ width: '50%', height: 10, borderRadius: 6, marginTop: 5 }} />
              </div>
            ))
          ) : filteredConvs.length === 0 ? (
            <div className="assistant__conv-empty">
              <MessageSquare size={20} />
              <span>{searching ? 'No results found' : 'No conversations yet'}</span>
            </div>
          ) : (
            Object.entries(grouped).map(([label, convs]) => {
              if (convs.length === 0) return null;
              return (
                <div key={label} className="assistant__conv-group" role="group" aria-label={label}>
                  <div className="assistant__conv-group-label section-label">{label}</div>
                  {convs.map(conv => (
                    <div
                      key={conv.id}
                      role="button"
                      tabIndex={0}
                      className={`assistant__conv-item ${activeConvId === conv.id ? 'assistant__conv-item--active' : ''} ${loadingConvId === conv.id ? 'assistant__conv-item--loading' : ''}`}
                      onClick={() => selectConversation(conv.id)}
                      onKeyDown={e => e.key === 'Enter' && selectConversation(conv.id)}
                      aria-current={activeConvId === conv.id ? 'page' : undefined}
                    >
                      <MessageSquare size={13} className="assistant__conv-icon" aria-hidden="true" />
                      <div className="assistant__conv-info">
                        <span className="assistant__conv-title">{conv.title}</span>
                        <span className="assistant__conv-preview">{conv.preview || 'Start conversation…'}</span>
                      </div>
                      <div className="assistant__conv-meta">
                        {conv.timestamp && (
                          <span className="assistant__conv-time">{formatDate(conv.timestamp)}</span>
                        )}
                        <button
                          type="button"
                          className="assistant__conv-delete btn btn-ghost"
                          onClick={e => promptDeleteConversation(conv, e)}
                          aria-label={`Delete conversation: ${conv.title}`}
                          title="Delete chat"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </aside>

      {/* ── MAIN: Chat Area ── */}
      <main className="assistant__chat" aria-label="BIS-AI Chat">
        <div
          className="assistant__messages"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {/* Welcome Screen with Animated AI style */}
          {messages.length === 0 && !loading && !loadingConvId && (
            <div className="assistant__welcome animate-fade-in">
              <div className="assistant__welcome-header">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="assistant__welcome-brand-badge"
                >
                  <Sparkles size={12} className="text-blue" />
                  <span>BIS-AI Standards Intelligence</span>
                </motion.div>

                <motion.h1
                  className="assistant__welcome-title"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  How can <span className="text-gradient-ai">BIS-AI</span> help today?
                </motion.h1>

                <motion.p
                  className="assistant__welcome-sub"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Ask anything about Indian Standards (IS), mandatory QCOs, testing clauses, and BIS compliance certification.
                </motion.p>
              </div>

              {/* Quick Action Prompt Chips */}
              <div className="assistant__welcome-prompts-grid">
                {SUGGESTED_PROMPTS.map((p, i) => (
                  <motion.button
                    key={i}
                    className="assistant__welcome-prompt-card card"
                    onClick={() => handleSend(p.query)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.08 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="assistant__prompt-emoji">{p.icon}</span>
                    <span className="assistant__prompt-label">{p.label}</span>
                    <ChevronRight size={13} className="assistant__prompt-arrow" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Loading conversation state */}
          {loadingConvId && messages.length === 0 && (
            <div className="assistant__conv-loading">
              <div className="assistant__conv-loading-dots">
                <span /><span /><span />
              </div>
              <span>Loading conversation…</span>
            </div>
          )}

          {/* Messages List */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`assistant__message assistant__message--${msg.role}${msg.isError ? ' assistant__message--error' : ''}`}
            >
              <div className="assistant__message-avatar" aria-hidden="true">
                {msg.role === 'user' ? (
                  <div className="assistant__user-avatar">
                    <UserIcon size={14} />
                  </div>
                ) : (
                  <div className="assistant__ai-avatar">
                    <AIOrb size="sm" animated={false} />
                  </div>
                )}
              </div>
              <div className="assistant__message-body">
                {msg.role === 'assistant' && msg.structured && msg.answer ? (
                  <AIResponse answer={msg.answer} />
                ) : (
                  <div className="assistant__message-text">{msg.content}</div>
                )}
                {msg.timestamp && (
                  <span className="assistant__message-time">
                    <Clock size={10} aria-hidden="true" />
                    {formatTime(msg.timestamp)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* In-chat BIS-AI Thinking Indicator */}
          {loading && (
            <div className="assistant__message assistant__message--assistant" aria-label="BIS-AI is thinking">
              <div className="assistant__message-avatar" aria-hidden="true">
                <div className="assistant__ai-avatar">
                  <AIOrb size="sm" animated state="processing" />
                </div>
              </div>
              <div className="assistant__message-body">
                <BISThinking
                  isVisible={loading}
                  thinkingText="BIS-AI is analyzing standards & regulatory data"
                  autoCompleteDelay={60000}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        {/* ── Modern Animated AI Input Area ── */}
        <div className="assistant__input-container">
          {/* Floating Thinking Badge when typing */}
          <AnimatePresence>
            {loading && (
              <motion.div
                className="assistant__floating-thinking"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
              >
                <div className="assistant__floating-badge">
                  <span className="assistant__floating-brand">BIS-AI</span>
                  <span className="assistant__floating-text">Thinking</span>
                  <TypingDots />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Command Palette Dropdown */}
          <AnimatePresence>
            {showCommandPalette && (
              <motion.div
                ref={commandPaletteRef}
                className="assistant__command-palette card"
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
              >
                <div className="assistant__command-palette-header">
                  <span className="section-label">BIS-AI Commands</span>
                  <span className="text-xs text-muted">Tab or Enter to select</span>
                </div>
                <div className="assistant__command-list">
                  {COMMAND_SUGGESTIONS.map((cmd, idx) => {
                    const Icon = cmd.icon;
                    return (
                      <div
                        key={cmd.prefix}
                        className={`assistant__command-item ${activeSuggestion === idx ? 'assistant__command-item--active' : ''}`}
                        onClick={() => selectCommand(cmd)}
                      >
                        <div className="assistant__command-icon-wrap">
                          <Icon size={14} />
                        </div>
                        <div className="assistant__command-info">
                          <span className="assistant__command-label">{cmd.label}</span>
                          <span className="assistant__command-desc">{cmd.description}</span>
                        </div>
                        <span className="assistant__command-prefix">{cmd.prefix}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Textarea Glass Box */}
          <div className={`assistant__input-box ${loading ? 'assistant__input-box--disabled' : ''}`}>
            <div className="assistant__input-inner">
              <textarea
                ref={textareaRef}
                className="assistant__textarea"
                placeholder="Ask BIS-AI about standards, QCOs, certification, testing clauses… (Type / for commands)"
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                rows={1}
                aria-label="Ask BIS-AI"
                id="assistant-input"
                disabled={loading}
              />
            </div>

            {/* Bottom Actions Bar */}
            <div className="assistant__input-footer">
              <div className="assistant__input-tools">
                <button
                  type="button"
                  className="assistant__tool-btn btn btn-ghost"
                  onClick={handleAttachFile}
                  title="Attach standard document or specification"
                  aria-label="Attach document"
                >
                  <Paperclip size={15} />
                  <span>Attach</span>
                </button>

                <button
                  type="button"
                  className={`assistant__tool-btn btn btn-ghost ${showCommandPalette ? 'assistant__tool-btn--active' : ''}`}
                  onClick={() => setShowCommandPalette(prev => !prev)}
                  title="Trigger BIS-AI Commands"
                  aria-label="Toggle commands"
                >
                  <Command size={14} />
                  <span>Commands</span>
                </button>
              </div>

              <div className="assistant__input-submit-wrap">
                {input.trim() && (
                  <button
                    type="button"
                    className="btn btn-ghost assistant__clear-input-btn"
                    onClick={() => {
                      setInput('');
                      adjustHeight(true);
                    }}
                    title="Clear input"
                  >
                    <X size={14} />
                  </button>
                )}

                <motion.button
                  type="button"
                  className={`btn btn-primary assistant__send-action-btn ${!input.trim() || loading ? 'assistant__send-action-btn--disabled' : ''}`}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  whileHover={input.trim() && !loading ? { scale: 1.02 } : {}}
                  whileTap={input.trim() && !loading ? { scale: 0.97 } : {}}
                  id="assistant-send"
                >
                  {loading ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>Send</span>
                </motion.button>
              </div>
            </div>
          </div>

          <p className="assistant__input-disclaimer">
            BIS-AI provides standards and regulatory intelligence. Always verify statutory mandates with official BIS gazette notifications at{' '}
            <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer">bis.gov.in</a>.
          </p>
        </div>
      </main>

      {/* ── RIGHT: Evidence & Sources Panel ── */}
      <aside className="assistant__evidence" aria-label="Evidence and sources">
        <div className="assistant__evidence-header">
          <span className="section-label">Evidence &amp; Sources</span>
          <span className="badge badge-blue">BIS-AI Verified</span>
        </div>

        {activeSources.length > 0 ? (
          <div className="assistant__evidence-sources">
            {activeSources.map((src, i) => (
              <div key={i} className="assistant__evidence-card">
                <div className="assistant__evidence-type badge badge-muted">{src.source_type || 'Official'}</div>
                <div className="assistant__evidence-title">{src.title}</div>
                <div className="assistant__evidence-domain">{src.domain || 'bis.gov.in'}</div>
                {src.relevance && (
                  <div className="assistant__evidence-relevance">{src.relevance}</div>
                )}
                <div className="verified-badge" style={{ marginTop: 8, width: 'fit-content' }}>
                  <Shield size={10} aria-hidden="true" /> Official Regulatory Reference
                </div>
                {src.url && (
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="btn btn-secondary btn-sm assistant__evidence-link"
                  >
                    <ExternalLink size={11} aria-hidden="true" /> View Official Portal
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="assistant__evidence-empty">
            <Bot size={28} aria-hidden="true" />
            <p>Official regulatory references, standard clauses, and BIS sources will automatically appear here when BIS-AI responds.</p>
          </div>
        )}

        <div className="assistant__evidence-note">
          <p>Bureau of Indian Standards (BIS) is the National Standards Body of India. BIS-AI provides verified compliance intelligence for industries and consumers.</p>
        </div>
      </aside>

      {/* ── Reconfirmation Modal on Chat Delete ── */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? All chat messages will be permanently removed."
        itemTitle={deleteModal.title}
        onConfirm={confirmDeleteConversation}
        onCancel={() => setDeleteModal({ isOpen: false, convId: null, title: '' })}
        confirmLabel="Delete Chat"
      />
    </div>
  );
}
