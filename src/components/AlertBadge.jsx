import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const CONFIG = {
  high:   { Icon: AlertTriangle, color: 'var(--color-high)',   bg: 'var(--color-high-bg)',   border: 'rgba(239,68,68,0.3)',   label: 'Critical' },
  medium: { Icon: AlertCircle,   color: 'var(--color-medium)', bg: 'var(--color-medium-bg)', border: 'rgba(245,158,11,0.3)',  label: 'Warning'  },
  info:   { Icon: Info,          color: 'var(--accent-light)', bg: 'rgba(99,102,241,0.1)',   border: 'rgba(99,102,241,0.25)', label: 'Info'     },
};

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 10) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

export default function AlertBadge({ alert, compact = false }) {
  const cfg = CONFIG[alert.severity] || CONFIG.info;
  const { Icon } = cfg;

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.8rem',
        color: cfg.color,
      }}>
        <Icon size={14} />
        <span style={{ flex: 1, color: 'var(--text-primary)' }}>{alert.msg}</span>
      </div>
    );
  }

  return (
    <div className="card" style={{
      borderColor: cfg.border,
      padding: '1.25rem',
      display: 'flex',
      gap: '1rem',
      alignItems: 'flex-start',
    }}>
      {/* Icon bubble */}
      <div style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: '10px',
        width: 38,
        height: 38,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color: cfg.color,
      }}>
        <Icon size={18} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: cfg.color,
          }}>{cfg.label}</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{timeAgo(alert.ts)}</span>
        </div>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
          {alert.msg}
        </div>
        {alert.action && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            → {alert.action}
          </div>
        )}
      </div>
    </div>
  );
}
