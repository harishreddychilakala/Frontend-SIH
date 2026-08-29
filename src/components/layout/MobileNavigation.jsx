import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, BookOpen, ShieldCheck, User } from 'lucide-react';
import './MobileNavigation.css';

const mobileNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/standards', icon: BookOpen, label: 'Standards' },
  { to: '/assistant', icon: MessageSquare, label: 'AI Chat' },
  { to: '/compliance', icon: ShieldCheck, label: 'Compliance' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNavigation() {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`
          }
        >
          <item.icon size={20} className="mobile-nav__icon" />
          <span className="mobile-nav__label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
