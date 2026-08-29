import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';
import savedService from '../services/savedService.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bis_theme') || 'dark';
  });

  // Auth
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => authService.isAuthenticated());

  // Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Saved Standards
  const [savedStandardIds, setSavedStandardIds] = useState([]);

  // Load saved standards from Neon backend on auth
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

  // Toast system
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Auth actions
  const login = async (email, password) => {
    const { user: u } = await authService.login(email, password);
    setUser(u);
    setIsAuthenticated(true);
    return u;
  };

  const signup = async (data) => {
    const { user: u } = await authService.signup(data);
    setUser(u);
    setIsAuthenticated(true);
    return u;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (data) => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
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
        addToast('Standard removed from saved', 'info');
      } catch (err) {
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
      } catch (err) {
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
