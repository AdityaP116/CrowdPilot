import { getDensityColor } from '../data/simulation';

export default function ZoneCard({ zone, onClick, highlight = false }) {
  const color = getDensityColor(zone.density);
  const levelLabel = zone.level === 'high' ? 'High' : zone.level === 'medium' ? 'Medium' : 'Low';

  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        borderColor: highlight ? color : undefined,
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: highlight ? `0 4px 20px ${color}35` : undefined,
        padding: '1.15rem',
        position: 'relative',
        zIndex: highlight ? 2 : 1, // pop out on active
      }}
    >
      {/* subtle gradient tint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(135deg, ${color}08 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      {/* Zone Type Pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
        <div>
          <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '0.15rem' }}>
            {zone.type}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{zone.name}</div>
        </div>
        <span className={`badge badge-${zone.level}`}>{levelLabel}</span>
      </div>

      {/* Density number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1 }}>{zone.density}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>% capacity</span>
      </div>

      {/* Progress bar */}
      <div className="density-bar">
        <div
          className="density-bar-fill"
          style={{ width: `${zone.density}%`, background: color }}
        />
      </div>
    </div>
  );
}
