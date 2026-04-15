import { NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Clock, Bell } from 'lucide-react';

const USER_LINKS = [
  { to: '/',        icon: Home,  label: 'Home'   },
  { to: '/map',     icon: Map,   label: 'Map'    },
  { to: '/queue',   icon: Clock, label: 'Queue'  },
  { to: '/alerts',  icon: Bell,  label: 'Alerts' },
];

export default function Navbar({ alertCount = 0 }) {
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(15,23,42,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(99,102,241,0.12)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '0.5rem 0 calc(0.5rem + env(safe-area-inset-bottom))',
      zIndex: 100,
      width: '100%',
      maxWidth: '480px',
    }}>
      {USER_LINKS.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to;
        const isAlerts = to === '/alerts';
        return (
          <NavLink
            key={to}
            to={to}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.4rem 1.2rem',
              borderRadius: '12px',
              textDecoration: 'none',
              color: active ? 'var(--accent-light)' : 'var(--text-muted)',
              background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <span style={{ position: 'relative' }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {isAlerts && alertCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-6px',
                  background: 'var(--color-high)',
                  color: '#fff',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                }}>
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </span>
            <span style={{ fontSize: '0.65rem', fontWeight: active ? 700 : 500 }}>{label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
