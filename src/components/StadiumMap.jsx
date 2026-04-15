import { useState } from 'react';
import { getDensityColor, getDensityGlow } from '../data/simulation';

// Geometry definitions for the Immersive Oval Stadium (ViewBox 0 0 200 160)
// Center is (100, 80)
const ZONE_PATHS = {
  // Stands (Bowl shape around the field)
  'stands-north': {
    type: 'path',
    d: 'M 40,45 Q 100,20 160,45 L 145,60 Q 100,45 55,60 Z',
    labelX: 100, labelY: 35
  },
  'stands-south': {
    type: 'path',
    d: 'M 40,115 Q 100,140 160,115 L 145,100 Q 100,115 55,100 Z',
    labelX: 100, labelY: 125
  },
  'stands-west': {
    type: 'path',
    d: 'M 40,45 L 55,60 Q 40,80 55,100 L 40,115 Q 20,80 40,45 Z',
    labelX: 35, labelY: 80
  },
  'stands-east': {
    type: 'path',
    d: 'M 160,45 L 145,60 Q 160,80 145,100 L 160,115 Q 180,80 160,45 Z',
    labelX: 165, labelY: 80
  },
  // Gates (Outer perimeter)
  'gate-a': { type: 'circle', cx: 20, cy: 30, r: 8, labelX: 20, labelY: 20 },  // NW
  'gate-b': { type: 'circle', cx: 180, cy: 30, r: 8, labelX: 180, labelY: 20 }, // NE
  'gate-c': { type: 'circle', cx: 20, cy: 130, r: 8, labelX: 20, labelY: 142 }, // SW
  'gate-d': { type: 'circle', cx: 180, cy: 130, r: 8, labelX: 180, labelY: 142 },// SE
  
  // Amenities (Concourse)
  'food-court': { type: 'rect', x: 80, y: 5, w: 40, h: 10, rx: 4, labelX: 100, labelY: 10 },
  'restroom-1': { type: 'rect', x: 5, y: 70, w: 10, h: 20, rx: 3, labelX: 10, labelY: 65 },
  'restroom-2': { type: 'rect', x: 185, y: 70, w: 10, h: 20, rx: 3, labelX: 190, labelY: 65 },
};

export default function StadiumMap({ zones, bestGateId, onZoneClick }) {
  const [hoveredZone, setHoveredZone] = useState(null);

  // Helper to generate routing lines
  const getRoutePath = (gateId) => {
    const pts = {
      'gate-a': 'M 20,30 Q 50,50 100,80',
      'gate-b': 'M 180,30 Q 150,50 100,80',
      'gate-c': 'M 20,130 Q 50,110 100,80',
      'gate-d': 'M 180,130 Q 150,110 100,80',
    };
    return pts[gateId] || '';
  };

  return (
    <div style={{
      background: 'radial-gradient(ellipse at center, #1E293B 0%, #0B1220 100%)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
    }}>
      <svg
        viewBox="0 0 200 160"
        style={{ width: '100%', height: 'auto', display: 'block', dropShadow: '0 10px 20px rgba(0,0,0,0.5)' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* Outer Stadium Perimeter Outline */}
        <ellipse cx="100" cy="80" rx="95" ry="75" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        <ellipse cx="100" cy="80" rx="90" ry="70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

        {/* Central Pitch */}
        <rect x="55" y="60" width="90" height="40" rx="4" fill="url(#fieldGrad)" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
        <circle cx="100" cy="80" r="8" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
        <line x1="100" y1="60" x2="100" y2="100" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
        <rect x="55" y="70" width="12" height="20" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
        <rect x="133" y="70" width="12" height="20" fill="none" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />

        {/* Rendering Zones */}
        {zones.map((zone) => {
          const geo = ZONE_PATHS[zone.id];
          if (!geo) return null; // Fallback if ID is missing

          const isHovered = hoveredZone === zone.id;
          const isBest = zone.id === bestGateId;
          const color = getDensityColor(zone.density);
          const glow = getDensityGlow(zone.density);

          return (
            <g 
              key={zone.id} 
              onClick={() => onZoneClick && onZoneClick(zone)}
              onMouseEnter={() => setHoveredZone(zone.id)}
              onMouseLeave={() => setHoveredZone(null)}
              style={{ cursor: onZoneClick ? 'pointer' : 'default', transition: 'all 0.3s ease' }}
            >
              {/* Animated Best Route Line */}
              {isBest && geo.type === 'circle' && (
                <path
                  d={getRoutePath(zone.id)}
                  fill="none"
                  stroke="#818CF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ animation: 'dash 2s linear infinite', filter: 'drop-shadow(0 0 4px #818CF8)' }}
                />
              )}

              {/* The Zone Shape */}
              {geo.type === 'path' && (
                <path
                  d={geo.d}
                  fill={isHovered ? color : `${color}60`}
                  stroke={isHovered ? '#fff' : color}
                  strokeWidth={isHovered ? 1 : 0.5}
                  style={{
                    filter: `drop-shadow(0 0 ${zone.density >= 70 ? '8px' : '4px'} ${glow})`,
                    transition: 'all 0.4s ease',
                  }}
                />
              )}
              {geo.type === 'circle' && (
                <circle
                  cx={geo.cx} cy={geo.cy} r={isHovered ? geo.r + 1 : geo.r}
                  fill={isHovered ? color : `${color}60`}
                  stroke={isBest ? '#818CF8' : (isHovered ? '#fff' : color)}
                  strokeWidth={isBest ? 1.5 : (isHovered ? 1 : 0.5)}
                  style={{
                    filter: `drop-shadow(0 0 ${zone.density >= 70 ? '8px' : '4px'} ${glow})`,
                    transition: 'all 0.4s ease',
                  }}
                />
              )}
              {geo.type === 'rect' && (
                <rect
                  x={geo.x} y={geo.y} width={geo.w} height={geo.h} rx={geo.rx}
                  fill={isHovered ? color : `${color}60`}
                  stroke={isHovered ? '#fff' : color}
                  strokeWidth={isHovered ? 1 : 0.5}
                  style={{
                    filter: `drop-shadow(0 0 ${zone.density >= 70 ? '8px' : '4px'} ${glow})`,
                    transition: 'all 0.4s ease',
                  }}
                />
              )}

              {/* Central Floating Text (only percentage, clean) */}
              <text
                x={geo.labelX}
                y={geo.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize={isHovered ? "5" : "4.5"}
                fontWeight="800"
                fontFamily="Inter, sans-serif"
                style={{
                  pointerEvents: 'none',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  transition: 'all 0.2s ease',
                }}
              >
                {zone.density}%
              </text>

              {/* Hover Tooltip Label */}
              {isHovered && (
                <g style={{ pointerEvents: 'none' }}>
                  <rect 
                    x={geo.labelX - 25} y={geo.labelY - 12} 
                    width="50" height="8" rx="2" 
                    fill="rgba(15, 23, 42, 0.9)" 
                    stroke={color} strokeWidth="0.5" 
                  />
                  <text
                    x={geo.labelX} y={geo.labelY - 8}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="var(--text-primary)" fontSize="3.5" fontWeight="600" fontFamily="Inter, sans-serif"
                  >
                    {zone.name}
                  </text>
                </g>
              )}

              {/* Best route indicator star */}
              {isBest && geo.type === 'circle' && (
                <text x={geo.labelX} y={geo.labelY - 14} textAnchor="middle" fill="#818CF8" fontSize="6" style={{ filter: 'drop-shadow(0 0 2px #818CF8)' }}>
                  ★
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Route Animation Stylesheet */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
      `}</style>
    </div>
  );
}
