import { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useCrowdData } from './hooks/useCrowdData';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';
import CrowdMap from './pages/user/CrowdMap';
import QueueStatus from './pages/user/QueueStatus';
import Alerts from './pages/user/Alerts';
import Dashboard from './pages/admin/Dashboard';
import { Activity, LayoutDashboard, Smartphone } from 'lucide-react';

export const CrowdContext = createContext(null);

// ── Mode Switcher shown at top when in mobile user view ──────────────────────
function ModeBanner({ mode, setMode }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  if (isAdmin) return null;

  return (
    <div style={{
      background: 'rgba(15,23,42,0.95)',
      borderBottom: '1px solid rgba(99,102,241,0.12)',
      padding: '0.5rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
      maxWidth: '480px',
      margin: '0 auto',
      width: '100%',
    }}>
      <Smartphone size={12} />
      <span>User App</span>
      <span style={{ color: 'var(--border)' }}>·</span>
      <Link to="/admin" style={{
        color: 'var(--accent-light)',
        textDecoration: 'none',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}>
        <LayoutDashboard size={12} />
        Switch to Admin Dashboard →
      </Link>
    </div>
  );
}

function AdminBanner() {
  const location = useLocation();
  if (location.pathname !== '/admin') return null;
  return (
    <div style={{
      background: 'rgba(15,23,42,0.97)',
      borderBottom: '1px solid rgba(99,102,241,0.15)',
      padding: '0.45rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.6rem',
      fontSize: '0.72rem',
      color: 'var(--text-muted)',
    }}>
      <Activity size={12} color="var(--accent-light)" />
      <span style={{ fontWeight: 700, color: 'var(--accent-light)' }}>CrowdPulse Admin</span>
      <span style={{ color: 'var(--border)' }}>·</span>
      <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <Smartphone size={11} />
        View User App
      </Link>
    </div>
  );
}

function AppShell() {
  const crowdData = useCrowdData();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const alertCount = crowdData.alerts?.filter(a => a.severity === 'high').length ?? 0;

  return (
    <CrowdContext.Provider value={crowdData}>
      <AdminBanner />
      <ModeBanner />

      {/* Mobile frame wrapper for user app */}
      {!isAdmin && (
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 36px)',
          position: 'relative',
          background: 'var(--bg-primary)',
        }}>
          <Routes>
            <Route path="/"       element={<Home />} />
            <Route path="/map"    element={<CrowdMap />} />
            <Route path="/queue"  element={<QueueStatus />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
          <Navbar alertCount={alertCount} />
        </div>
      )}

      {/* Admin full-width */}
      {isAdmin && (
        <Routes>
          <Route path="/admin" element={<Dashboard />} />
        </Routes>
      )}
    </CrowdContext.Provider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
