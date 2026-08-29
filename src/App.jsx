import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import { ToastContainer } from './components/ui/Toast.jsx';

// Layout
import AppLayout from './components/layout/AppLayout.jsx';

// Public pages
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';

// App pages
import Dashboard from './pages/Dashboard.jsx';
import Assistant from './pages/Assistant.jsx';
import Standards from './pages/Standards.jsx';
import StandardDetails from './pages/StandardDetails.jsx';
import Compliance from './pages/Compliance.jsx';
import Documents from './pages/Documents.jsx';
import Compare from './pages/Compare.jsx';
import Services from './pages/Services.jsx';
import Laboratories from './pages/Laboratories.jsx';
import Saved from './pages/Saved.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import Settings from './pages/Settings.jsx';

const router = createBrowserRouter([
  // Public routes
  { path: '/', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/forgot-password', element: <ForgotPassword /> },

  // Protected application routes
  {
    element: <AppLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/assistant', element: <Assistant /> },
      { path: '/standards', element: <Standards /> },
      { path: '/standards/:id', element: <StandardDetails /> },
      { path: '/compliance', element: <Compliance /> },
      { path: '/documents', element: <Documents /> },
      { path: '/compare', element: <Compare /> },
      { path: '/services', element: <Services /> },
      { path: '/laboratories', element: <Laboratories /> },
      { path: '/saved', element: <Saved /> },
      { path: '/history', element: <History /> },
      { path: '/profile', element: <Profile /> },
      { path: '/settings', element: <Settings /> },
    ],
  },

  // Fallback
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AppProvider>
  );
}
