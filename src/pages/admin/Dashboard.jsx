import { useContext, useState } from 'react';
import { CrowdContext } from '../../App';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Activity, Users, AlertTriangle, Lightbulb,
  RefreshCw, Shield, Bell, Settings, LogOut, Zap,
  LayoutDashboard, Map as MapIcon
} from 'lucide-react';
import { getDensityColor } from '../../data/simulation';

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const density = payload[0]?.value;
  const color = getDensityColor(density);
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: `1px solid ${color}60`,
      borderRadius: 'var(--radius-md)',
      padding: '0.75rem 1rem',
      fontSize: '0.8rem',
      boxShadow: 'var(--shadow-card)',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 600 }}>{label}</div>
      <div style={{ color, fontWeight: 800, fontSize: '1.2rem' }}>{density}%</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>crowd density</div>
    </div>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
function AdminSidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'overview',   icon: LayoutDashboard, label: 'Overview'   },
    { id: 'map',        icon: MapIcon,         label: 'Zone Map'   },
    { id: 'alerts',     icon: Bell,            label: 'Alerts'     },
    { id: 'settings',   icon: Settings,        label: 'Settings'   },
  ];

  return (
    <aside className="admin-sidebar" style={{ background: 'var(--bg-secondary)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`sidebar-item ${activeTab === id ? 'active' : ''}`}
            style={{ 
              background: activeTab === id ? 'var(--color-low-bg)' : 'transparent',
              border: activeTab === id ? '1px solid var(--accent)' : '1px solid transparent', 
              width: '100%', textAlign: 'left', padding: '0.75rem 1rem' 
            }}
          >
            <Icon size={18} />
            <span style={{ fontSize: '0.9rem' }}>{label}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
        <button className="sidebar-item" style={{ width: '100%', color: 'var(--color-high)', border: '1px solid transparent', background: 'none' }}>
          <LogOut size={16} />
          <span style={{ fontSize: '0.9rem' }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '12px', padding: '0.6rem', color }}>
          <Icon size={22} />
        </div>
        {trend !== undefined && (
          <span style={{ 
            fontSize: '0.75rem', 
            color: trend >= 0 ? 'var(--color-high)' : 'var(--color-low)', 
            fontWeight: 800,
            background: trend >= 0 ? 'var(--color-high-bg)' : 'var(--color-low-bg)',
            padding: '0.2rem 0.5rem', borderRadius: '999px'
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div style={{ fontSize: '2.4rem', fontWeight: 800, color, lineHeight: 1.1, marginTop: '0.5rem' }}>{value}</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

// ── Suggestion Card ───────────────────────────────────────────────────────────
function SuggestionCard({ suggestion }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.02))',
      borderColor: 'rgba(99,102,241,0.3)',
      padding: '1.25rem',
      display: 'flex', gap: '1rem', alignItems: 'center'
    }}>
      <div style={{ background: 'var(--accent)', padding: '0.6rem', borderRadius: '10px', boxShadow: '0 4px 12px var(--accent-glow)' }}>
        <Lightbulb size={20} color="#fff" />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Auto-Suggestion
        </div>
        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '0.2rem' }}>
          {suggestion.text}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
          Zone: <strong style={{ color: 'var(--text-secondary)' }}>{suggestion.zoneName}</strong> ({suggestion.density}% capacity)
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        <button className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem' }}>Execute</button>
        <button className="btn btn-ghost btn-sm" style={{ padding: '0.5rem 1rem' }} onClick={() => setDismissed(true)}>Dismiss</button>
      </div>
    </div>
  );
}

// ── Zone Row ──────────────────────────────────────────────────────────────────
function ZoneRow({ zone }) {
  const color = getDensityColor(zone.density);
  const levelLabel = zone.level === 'high' ? 'High' : zone.level === 'medium' ? 'Medium' : 'Low';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 100px 140px 100px',
      gap: '1.5rem',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid var(--border-card)',
      transition: 'var(--transition)',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-glass-light)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <div>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{zone.name}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{zone.type}</div>
      </div>
      <div>
        <span className={`badge badge-${zone.level}`} style={{ padding: '0.3rem 0.6rem' }}>{levelLabel}</span>
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${zone.density}%`, background: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color, minWidth: 32 }}>{zone.density}%</span>
        </div>
      </div>
      <div>
        {zone.density >= 70 ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-high)', fontWeight: 700 }}>⚠ Critical</span>
        ) : zone.density >= 35 ? (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-medium)', fontWeight: 700 }}>Monitor</span>
        ) : (
          <span style={{ fontSize: '0.75rem', color: 'var(--color-low)', fontWeight: 700 }}>Stable</span>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { zones, alerts, overallStatus, suggestions, lastUpdated, forceRefresh } = useContext(CrowdContext);
  const [activeTab, setActiveTab] = useState('overview');

  const highCount   = zones.filter(z => z.level === 'high').length;
  const medCount    = zones.filter(z => z.level === 'medium').length;
  const lowCount    = zones.filter(z => z.level === 'low').length;
  const avgDensity  = zones.length ? Math.round(zones.reduce((s, z) => s + z.density, 0) / zones.length) : 0;
  const critAlerts  = alerts.filter(a => a.severity === 'high').length;

  const STATUS_COLOR = { Low: 'var(--color-low)', Moderate: 'var(--color-medium)', High: 'var(--color-high)' };

  const barData = zones.map(z => ({ name: z.name.replace('Stands ', 'Std ').replace('Restrooms', 'WC'), density: z.density }));

  return (
    <div className="admin-layout">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="admin-main">
        {/* Top Header */}
        <div className="fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
              {activeTab === 'overview' ? 'Dashboard Overview' :
               activeTab === 'map'      ? 'Zone Map Monitor' :
               activeTab === 'alerts'   ? 'Alert Center' : 'Settings'}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              <div className={`pulse-dot pulse-dot-${overallStatus.toLowerCase() === 'moderate' ? 'medium' : overallStatus.toLowerCase()}`} />
              Live · Updated {lastUpdated.toLocaleTimeString()}
              <span style={{ color: 'var(--border-card)' }}>|</span>
              Overall status: <strong style={{ color: STATUS_COLOR[overallStatus] }}>{overallStatus}</strong>
            </div>
          </div>
          <button className="btn btn-primary" onClick={forceRefresh} style={{ gap: '0.6rem' }}>
            <RefreshCw size={16} /> Sync Data
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="fade-in fade-in-1">
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              <StatCard icon={Users}         label="Avg Density"    value={`${avgDensity}%`} sub="Across all zones"          color="var(--accent-light)" />
              <StatCard icon={AlertTriangle} label="Critical Zones" value={highCount}         sub="Requires immediate action" color="var(--color-high)"   trend={highCount > 2 ? 12 : -5} />
              <StatCard icon={Shield}        label="Safe Zones"     value={lowCount}          sub="Operating normally"        color="var(--color-low)"    />
              <StatCard icon={Bell}          label="Active Alerts"  value={critAlerts}        sub="Critical system notifications" color="var(--color-medium)" />
            </div>

            {/* Charts row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Bar chart */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Zone Density Overview</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Real-time capacity tracking</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }} angle={-35} textAnchor="end" interval={0} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="density" radius={[6, 6, 0, 0]} maxBarSize={40}>
                      {barData.map((entry, i) => (
                        <Cell key={i} fill={getDensityColor(entry.density)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* KPI Breakdown */}
              <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Capacity Breakdown</div>
                {[
                  { label: 'High Priority',  count: highCount, total: zones.length, color: 'var(--color-high)'   },
                  { label: 'Medium Density', count: medCount,  total: zones.length, color: 'var(--color-medium)' },
                  { label: 'Safe Capacity',  count: lowCount,  total: zones.length, color: 'var(--color-low)'    },
                ].map(({ label, count, total, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
                      <span style={{ color, fontWeight: 800 }}>{count} / {total}</span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${total ? (count / total) * 100 : 0}%`, background: color, borderRadius: '999px', transition: 'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
                
                {/* AI Banner inside Breakdown */}
                <div style={{ marginTop: 'auto', background: 'var(--bg-glass-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-light)' }}>
                    <Zap size={16} /> 
                    <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>System Health</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.4rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    Overall stadium load is at <strong style={{ color: 'var(--text-primary)' }}>{avgDensity}%</strong>. {overallStatus === 'High' ? 'Intervention needed.' : 'System stable.'}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Suggestions Row */}
            {suggestions.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Zap size={18} color="var(--accent-light)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Recommended Actions</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
                  {suggestions.map((s, i) => <SuggestionCard key={s.zoneId} suggestion={s} />)}
                </div>
              </div>
            )}

            {/* Zone List Table */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-card)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Live Zone Monitor</div>
                <span className="badge badge-medium">{zones.length} Active Zones</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 140px 100px',
                gap: '1.5rem',
                padding: '0.8rem 1.5rem',
                background: 'rgba(255,255,255,0.02)',
                fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}>
                <span>Location</span><span>Status</span><span>Capacity</span><span>Action</span>
              </div>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {[...zones].sort((a, b) => b.density - a.density).map(zone => (
                  <ZoneRow key={zone.id} zone={zone} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
