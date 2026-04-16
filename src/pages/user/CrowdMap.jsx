import { useContext, useState } from 'react';
import { CrowdContext } from '../../App';
import StadiumMap from '../../components/StadiumMap';
import ZoneCard from '../../components/ZoneCard';
import { Map, RefreshCw, Star } from 'lucide-react';

export default function CrowdMap() {
  const { zones, bestGate, forceRefresh, lastUpdated } = useContext(CrowdContext);
  const [selectedZone, setSelectedZone] = useState(null);

  const selected = selectedZone ? zones.find(z => z.id === selectedZone) : null;

  return (
    <div className="page">
      {/* ── Header ── */}
      <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', paddingTop: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--accent-glow)', padding: '0.4rem', borderRadius: '8px' }}>
              <Map size={20} color="var(--accent-light)" />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Live Crowd Map</h1>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontWeight: 600 }}>
            Updated {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={forceRefresh} style={{ gap: '0.4rem', borderRadius: '10px' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* ── Best Route Banner ── */}
      {bestGate && (
        <div className="fade-in fade-in-1" style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
          border: '1px dashed rgba(99,102,241,0.45)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          marginBottom: '1.5rem',
          boxShadow: '0 8px 24px rgba(99,102,241,0.1)'
        }}>
          <Star size={20} color="var(--accent-light)" fill="var(--accent-light)" />
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Best Route Suggestion</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
              Head to <strong style={{ color: 'var(--accent-light)' }}>{bestGate.name}</strong> — least crowded at {bestGate.density}%
            </div>
          </div>
        </div>
      )}

      {/* ── SVG Map ── */}
      <div className="fade-in fade-in-2" style={{ marginBottom: '2rem' }}>
        <StadiumMap zones={zones} bestGateId={bestGate?.id} onZoneClick={z => setSelectedZone(z.id === selectedZone ? null : z.id)} />
      </div>

      {/* ── Selected Zone Detail ── */}
      {selected && (
        <div className="fade-in" style={{ marginBottom: '2rem' }}>
          <div className="section-title">Selected Zone Insight</div>
          <ZoneCard zone={selected} highlight />
        </div>
      )}

      {/* ── All Zones List ── */}
      <div className="section-title fade-in fade-in-3">All Zones Monitor</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {[...zones].sort((a, b) => b.density - a.density).map((zone, i) => (
          <div key={zone.id} className={`fade-in fade-in-${Math.min(i + 3, 5)}`}>
            <ZoneCard zone={zone} highlight={zone.id === selectedZone} onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
