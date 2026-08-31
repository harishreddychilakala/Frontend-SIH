import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, MessageSquare, BookOpen, GitCompare,
  ShieldCheck, Building2, FlaskConical, FileText,
  History, Settings,
} from 'lucide-react';
import { Dock, DockItem, DockIcon, DockLabel } from '../ui/Dock.jsx';
import '../ui/Dock.css';
import './DockNav.css';

const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assistant',    icon: MessageSquare,   label: 'AI Assistant' },
  { to: '/standards',    icon: BookOpen,        label: 'Standards Explorer' },
  { to: '/compare',      icon: GitCompare,      label: 'Compare Standards' },
  { to: '/compliance',   icon: ShieldCheck,     label: 'Compliance Checker' },
  { to: '/services',     icon: Building2,       label: 'BIS Services' },
  { to: '/laboratories', icon: FlaskConical,    label: 'Laboratories' },
  { to: '/documents',    icon: FileText,        label: 'Documents' },
  { to: '/history',      icon: History,         label: 'Chat History' },
  { to: '/settings',     icon: Settings,        label: 'Settings' },
];

export default function DockNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="dock-nav" aria-label="Main navigation">
      <Dock
        magnification={68}
        distance={130}
        panelHeight={60}
        spring={{ mass: 0.1, stiffness: 160, damping: 14 }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.to ||
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <DockItem
              key={item.to}
              onClick={() => navigate(item.to)}
              className={isActive ? 'bis-dock__item--active' : ''}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <DockIcon>
                <div className="bis-dock__icon-inner">
                  <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
              </DockIcon>
              <DockLabel>{item.label}</DockLabel>
            </DockItem>
          );
        })}
      </Dock>
    </div>
  );
}
