import { useContext, useState } from 'react';
import { CrowdContext } from '../../App';
import { Clock, Utensils, DoorOpen, Bath, CheckCircle2, Users, ChevronRight } from 'lucide-react';
import { getDensityColor } from '../../data/simulation';

const ICONS = { gate: DoorOpen, food: Utensils, restroom: Bath };

export default function QueueStatus() {
  const { queues, lastUpdated } = useContext(CrowdContext);
  const [joined, setJoined] = useState({});

  const handleJoin = (id) => {
    setJoined(prev => ({ ...prev, [id]: true }));
  };

  const categories = [
    { key: 'gate',    label: 'Entry Gates',  icon: DoorOpen },
    { key: 'food',    label: 'Food & Drinks', icon: Utensils },
    { key: 'restroom',label: 'Restrooms',     icon: Bath     },
  ];

  return (
    <div className="page" style={{ paddingBottom: '6rem' }}>
      {/* ── Header ── */}
      <div className="fade-in" style={{ paddingTop: '0.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div style={{ background: 'rgba(245,158,11,0.15)', padding: '0.4rem', borderRadius: '8px' }}>
            <Clock size={20} color="var(--color-medium)" />
          </div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Queue Status</h1>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Live wait times · Updated {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* ── Summary Banner ── */}
      <div className="fade-in fade-in-1" style={{
        background: 'linear-gradient(135deg, var(--bg-card), rgba(99,102,241,0.05))',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        alignItems: 'center',
        boxShadow: 'var(--shadow-card)'
      }}>
        <div style={{ background: 'var(--accent-glow)', padding: '0.6rem', borderRadius: '50%' }}>
          <Users size={24} color="var(--accent-light)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shortest Wait Right Now</div>
          {(() => {
            const shortest = [...queues].sort((a, b) => a.waitTime - b.waitTime)[0];
            return <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 500 }}>
              <strong style={{ color: 'var(--color-low)' }}>{shortest?.name}</strong> — {shortest?.waitTime} min wait
            </div>;
          })()}
        </div>
      </div>

      {/* ── Grouped by Category ── */}
      {categories.map((cat, ci) => {
        const items = queues.filter(q => q.icon === cat.key);
        if (!items.length) return null;
        const CatIcon = cat.icon;
        return (
          <div key={cat.key} className={`fade-in fade-in-${ci + 2}`} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <CatIcon size={16} color="var(--text-muted)" />
              <div className="section-title" style={{ margin: 0, fontSize: '0.8rem' }}>{cat.label}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((q) => {
                const color = getDensityColor(q.density);
                const isJoined = joined[q.id];
                const ItemIcon = ICONS[q.icon] || Clock;
                return (
                  <div key={q.id} className="card" style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      {/* Icon */}
                      <div style={{
                        width: 48, height: 48, borderRadius: '12px',
                        background: `${color}18`,
                        border: `1px solid ${color}30`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <ItemIcon size={22} color={color} />
                      </div>

                      {/* Info Header */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>{q.name}</div>
                          <span className={`badge badge-${q.level}`} style={{ padding: '0.25rem 0.6rem', fontSize: '0.65rem' }}>
                            {q.level}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
                          <Clock size={13} color="var(--text-muted)" />
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            Est. wait: <strong style={{ color, fontSize: '0.9rem' }}>{q.waitTime} min</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Detail */}
                    <div>
                      <div className="density-bar" style={{ height: 8 }}>
                        <div className="density-bar-fill" style={{ width: `${q.density}%`, background: color }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span>Empty</span>
                        <span>{q.density}% Full</span>
                      </div>
                    </div>

                    {/* Join Button */}
                    <button
                      className={`btn btn-full ${isJoined ? 'btn-ghost' : 'btn-outline'}`}
                      onClick={() => handleJoin(q.id)}
                      disabled={isJoined}
                      style={{ 
                        marginTop: '0.25rem',
                        padding: '0.75rem',
                        border: isJoined ? '1px solid var(--color-low)' : `1px solid var(--accent-light)`,
                        color: isJoined ? 'var(--color-low)' : 'var(--accent-light)',
                        background: isJoined ? 'var(--color-low-bg)' : 'transparent',
                      }}
                    >
                      {isJoined ? (
                        <><CheckCircle2 size={16} /> Virtual Queue Joined</>
                      ) : (
                        <>Join Virtual Queue <ChevronRight size={16}/></>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
