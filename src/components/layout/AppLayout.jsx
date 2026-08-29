import { Outlet, Navigate } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import DockNav from './DockNav.jsx';
import { useApp } from '../../context/AppContext.jsx';
import './AppLayout.css';

export default function AppLayout() {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <TopBar />
      <main className="app-content" id="main-content" tabIndex="-1">
        <Outlet />
      </main>
      <DockNav />
    </div>
  );
}
