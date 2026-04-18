import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Home, Map, Clock, Bell, Menu, X, LayoutDashboard, Activity, Smartphone } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',        icon: Home,  label: 'Home'    },
  { to: '/map',     icon: Map,   label: 'Map'     },
  { to: '/queue',   icon: Clock, label: 'Queue'   },
  { to: '/alerts',  icon: Bell,  label: 'Alerts'  },
  { to: '/admin',   icon: LayoutDashboard, label: 'Admin', isAdmin: true },
];

export default function WebNavbar({ alertCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`web-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Activity size={20} color="#fff" />
          </div>
          <div className="logo-text">
            <span>Crowd</span>Pilot
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop">
          {NAV_LINKS.map(({ to, icon: Icon, label, isAdmin }) => (
            <NavLink 
              key={to} 
              to={to} 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''} ${isAdmin ? 'admin-btn' : ''}`}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Alerts' && alertCount > 0 && (
                <span className="alert-count">{alertCount}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Mobile Actions */}
        <div className="nav-actions-mobile">
          <button className="menu-toggle" aria-label="Toggle mobile menu" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setIsOpen(false)}
              aria-current={location.pathname === to ? 'page' : undefined}
            >
              <Icon size={22} />
              <span>{label}</span>
              {label === 'Alerts' && alertCount > 0 && (
                <span className="alert-count">{alertCount}</span>
              )}
            </NavLink>
          ))}
          <div className="mobile-menu-footer">
            <Smartphone size={16} />
            <span>Responsive Web Experience</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
