import { useContext } from 'react';
import { CrowdContext } from '../../App';
import AlertBadge from '../../components/AlertBadge';
import { Bell, AlertTriangle, ShieldCheck, CheckCircle } from 'lucide-react';

export default function Alerts() {
  const { alerts, lastUpdated } = useContext(CrowdContext);

  const highAlerts   = alerts.filter(a => a.severity === 'high');
  const mediumAlerts = alerts.filter(a => a.severity === 'medium');
  const infoAlerts   = alerts.filter(a => a.severity === 'info');

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="fade-in" style={{ paddingTop: '0.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
          <div style={{ background: 'var(--color-high-bg)', padding: '0.5rem', borderRadius: '10px' }}>
            <Bell size={22} color="var(--color-high)" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Alert Center</h1>
          {alerts.length > 0 && (
            <span style={{
              background: 'var(--color-high)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
            }}>{alerts.length}</span>
          )}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Real-time system notifications · Updated {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* ── Critical Alerts ── */}
      {highAlerts.length > 0 && (
        <div className="fade-in fade-in-1" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={16} color="var(--color-high)" />
            <div className="section-title" style={{ margin: 0, color: 'var(--color-high)', fontSize: '0.8rem' }}>Critical System Alerts</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {highAlerts.map(a => <AlertBadge key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {/* ── Warning Alerts ── */}
      {mediumAlerts.length > 0 && (
        <div className="fade-in fade-in-2" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <AlertTriangle size={16} color="var(--color-medium)" />
            <div className="section-title" style={{ margin: 0, color: 'var(--color-medium)', fontSize: '0.8rem' }}>Zone Warnings</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {mediumAlerts.map(a => <AlertBadge key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {/* ── Info Alerts ── */}
      {infoAlerts.length > 0 && (
        <div className="fade-in fade-in-3" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <ShieldCheck size={16} color="var(--accent-light)" />
            <div className="section-title" style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Information & Updates</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
            {infoAlerts.map(a => <AlertBadge key={a.id} alert={a} />)}
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {alerts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 1.5rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-glass)',
          borderRadius: 'var(--radius-lg)',
          border: '1px dashed var(--border-card)',
        }}>
          <CheckCircle size={48} strokeWidth={1.5} style={{ marginBottom: '1rem', color: 'var(--color-low)', opacity: 0.8 }} />
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>All Clear!</div>
          <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>No active alerts or warnings at this time.</div>
        </div>
      )}
    </div>
  );
}
