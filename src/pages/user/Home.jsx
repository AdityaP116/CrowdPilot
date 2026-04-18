import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CrowdContext } from '../../App';
import {
  Activity, MapPin, Clock, Bell, ChevronRight,
  Users, Zap, Shield, TrendingUp,
} from 'lucide-react';
import AlertBadge from '../../components/AlertBadge';

// Updated internal mappings using the new design system colors
const STATUS_COLORS = { Low: 'var(--color-low)', Moderate: 'var(--color-medium)', High: 'var(--color-high)' };
const STATUS_BG     = { Low: 'var(--color-low-bg)', Moderate: 'var(--color-medium-bg)', High: 'var(--color-high-bg)' };

export default function Home() {
  const { zones, alerts, overallStatus, lastUpdated, bestGate } = useContext(CrowdContext);

  const highCount = zones.filter(z => z.level === 'high').length;
  const lowCount  = zones.filter(z => z.level === 'low').length;
  const avgDensity = zones.length ? Math.round(zones.reduce((s, z) => s + z.density, 0) / zones.length) : 0;
  const topAlerts = alerts.filter(a => a.severity === 'high').slice(0, 2);

  return (
    <div className="page">
      {/* ── Hero Profile ── */}
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', paddingTop: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px var(--accent-glow)'
            }}>
              <Activity size={24} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                CrowdPulse
              </div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-primary)' }}>National Stadium</h1>
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
            <Clock size={14} /> Updated {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* ── Desktop Hero Layout — sidebar stat cards + big status ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: '1.5rem', marginBottom: '2rem', alignItems: 'start' }}>
        {/* Status card */}
        <div className="fade-in fade-in-1 card" style={{
          border: `1px solid ${STATUS_COLORS[overallStatus]}30`,
          background: `linear-gradient(145deg, var(--bg-card), ${STATUS_BG[overallStatus]})`,
          boxShadow: `0 12px 35px ${STATUS_BG[overallStatus]}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '2rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div className={`pulse-dot pulse-dot-${overallStatus.toLowerCase() === 'moderate' ? 'medium' : overallStatus.toLowerCase()}`} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live Crowd Density</span>
            </div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: STATUS_COLORS[overallStatus], lineHeight: 1 }}>
              {overallStatus}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              {avgDensity}% average capacity across all zones
            </div>
          </div>
          <div style={{
            width: 90, height: 90,
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: `3px solid ${STATUS_COLORS[overallStatus]}80`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `inset 0 4px 12px rgba(0,0,0,0.5), 0 0 30px ${STATUS_COLORS[overallStatus]}20`,
          }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{avgDensity}%</span>
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Avg Cap</span>
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="fade-in fade-in-2" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { icon: Shield,     label: 'Safe Zones',    value: lowCount,      color: 'var(--color-low)'    },
            { icon: Users,      label: 'Total Zones',   value: zones.length,  color: 'var(--accent-light)' },
            { icon: TrendingUp, label: 'Active Alerts', value: highCount,     color: 'var(--color-high)'   },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: `${color}15`, padding: '0.6rem', borderRadius: '10px' }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '0.2rem' }}>{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Best Route Banner ── */}
      {bestGate && (
        <div className="fade-in fade-in-2" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.75rem',
          boxShadow: '0 8px 30px rgba(99,102,241,0.1)'
        }}>
          <div style={{ background: 'var(--accent)', padding: '0.6rem', borderRadius: '10px' }}>
            <Zap size={20} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Entry Right Now</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
              {bestGate.name} — Only {bestGate.density}% Full
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation Cards ── */}
      <div className="section-title fade-in fade-in-3">Explore & Navigate</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { to: '/map',    icon: MapPin, label: 'Live Stadium Map',  sub: 'View visual zone density',      color: '#6366F1' },
          { to: '/queue',  icon: Clock,  label: 'Service Queues',    sub: 'Real-time wait estimations',   color: '#F59E0B' },
          { to: '/alerts', icon: Bell,   label: 'Notifications',     sub: `${alerts.length} system wide alerts`, color: '#EF4444' },
        ].map(({ to, icon: Icon, label, sub, color }, i) => (
          <Link
            key={to}
            to={to}
            className={`card fade-in fade-in-${i + 3}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.1rem',
              textDecoration: 'none',
              padding: '1.25rem',
            }}
          >
            <div style={{
              width: 50, height: 50, borderRadius: '14px',
              background: `${color}18`,
              border: `1px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={24} color={color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{sub}</div>
            </div>
            <div style={{ background: 'var(--bg-glass)', padding: '0.5rem', borderRadius: '50%' }}>
              <ChevronRight size={18} color="var(--text-secondary)" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Live Alerts Preview ── */}
      {topAlerts.length > 0 && (
        <div className="fade-in fade-in-5" aria-live="polite">
          <div className="section-title">⚠ Critical Live Alerts</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {topAlerts.map(a => <AlertBadge key={a.id} alert={a} compact />)}
          </div>
        </div>
      )}
    </div>
  );
}
