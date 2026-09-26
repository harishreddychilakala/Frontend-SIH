import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import authService from '../services/authService.js';
import savedService from '../services/savedService.js';

const AppContext = createContext(null);

// Inactivity timeout duration (e.g. 60 minutes of complete user inactivity)
const INACTIVITY_TIMEOUT_MS = 60 * 60 * 1000;

export function AppProvider({ children }) {
  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bis_theme') || 'dark';
  });

  // Auth state initialized with validated token check
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  // Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Saved Standards
  const [savedStandardIds, setSavedStandardIds] = useState([]);

  // Refs for timer cleanup
  const tokenTimerRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  // Toast system
  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Load saved standards from backend on auth
  useEffect(() => {
    if (isAuthenticated) {
      savedService.getSavedStandards()
        .then(items => {
          setSavedStandardIds(items.map(s => s.standard_reference || s.id));
        })
        .catch(() => {});
    } else {
      setSavedStandardIds([]);
    }
  }, [isAuthenticated]);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bis_theme', theme);
  }, [theme]);

  // Handle logout
  const logout = useCallback(async (reason = null) => {
    // Clear timers
    if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

    try {
      await authService.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setSavedStandardIds([]);
      if (reason) {
        addToast(reason, 'warning');
      }
    }
  }, [addToast]);

  // 1. Proactive Token Expiration Timer
  useEffect(() => {
    if (!isAuthenticated) {
      if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
      return;
    }

    const remainingSec = authService.getTokenRemainingSeconds();
    if (remainingSec <= 0) {
      logout('Your session has expired. Please log in again.');
      return;
    }

    // Set timer for remaining duration (cap to max 32-bit int)
    const delayMs = Math.min(remainingSec * 1000, 2147483647);
    tokenTimerRef.current = setTimeout(() => {
      logout('Your session has expired. Please log in again to continue.');
    }, delayMs);

    return () => {
      if (tokenTimerRef.current) clearTimeout(tokenTimerRef.current);
    };
  }, [isAuthenticated, logout]);

  // 2. User Inactivity Auto-Logout
  useEffect(() => {
    if (!isAuthenticated) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      return;
    }

    const resetInactivityTimer = () => {
      lastActivityRef.current = Date.now();
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);

      inactivityTimerRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity >= INACTIVITY_TIMEOUT_MS) {
          logout('You were automatically logged out due to inactivity for security.');
        }
      }, INACTIVITY_TIMEOUT_MS);
    };

    // Events to track user interaction
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    let throttleTimeout = null;

    const handleUserActivity = () => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          throttleTimeout = null;
          resetInactivityTimer();
        }, 1000); // Throttle to 1s
      }
    };

    activityEvents.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));
    resetInactivityTimer();

    return () => {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      if (throttleTimeout) clearTimeout(throttleTimeout);
      activityEvents.forEach(evt => window.removeEventListener(evt, handleUserActivity));
    };
  }, [isAuthenticated, logout]);

  // 3. Listen for unauthorized 401 events dispatched by apiClient
  useEffect(() => {
    const handleUnauthorized = (e) => {
      const msg = e?.detail?.message || 'Your session has expired. Please log in again.';
      logout(msg);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  // Auth actions
  const login = async (email, password) => {
    const { user: u } = await authService.login(email, password);
    setUser(u);
    setIsAuthenticated(true);
    addToast(`Welcome back, ${u.name || 'User'}!`, 'success');
    return u;
  };

  const signup = async (data) => {
    const { user: u } = await authService.signup(data);
    setUser(u);
    setIsAuthenticated(true);
    addToast('Account created successfully!', 'success');
    return u;
  };

  const updateUser = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    addToast('Profile updated successfully', 'success');
    return updated;
  };

  // Saved standards (connected to Neon PostgreSQL)
  const toggleSaveStandard = async (standardOrId) => {
    const stdId = typeof standardOrId === 'string' ? standardOrId : standardOrId.id;
    const stdRef = typeof standardOrId === 'string' ? standardOrId : (standardOrId.number || standardOrId.id);
    const isSaved = savedStandardIds.includes(stdId) || savedStandardIds.includes(stdRef);

    if (isSaved) {
      try {
        await savedService.deleteSavedStandard(stdId);
        setSavedStandardIds(prev => prev.filter(s => s !== stdId && s !== stdRef));
        addToast('Standard removed from bookmarks', 'info');
      } catch {
        addToast('Failed to remove saved standard', 'error');
      }
    } else {
      try {
        const payload = typeof standardOrId === 'object' ? standardOrId : {
          id: stdId,
          number: stdRef,
          title: `Indian Standard ${stdRef}`,
          category: 'General',
        };
        await savedService.saveStandard(payload);
        setSavedStandardIds(prev => [...prev, stdRef]);
        addToast('Standard saved to bookmarks', 'success');
      } catch {
        addToast('Failed to save standard', 'error');
      }
    }
  };

  const isStandardSaved = (id) => savedStandardIds.includes(id);

  const value = {
    theme,
    setTheme,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    sidebarCollapsed,
    setSidebarCollapsed,
    mobileSidebarOpen,
    setMobileSidebarOpen,
    toasts,
    addToast,
    removeToast,
    savedStandardIds,
    toggleSaveStandard,
    isStandardSaved,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
