export const ZONES = [
  { id: 'gate-a', name: 'Gate A', type: 'gate' },
  { id: 'gate-b', name: 'Gate B', type: 'gate' },
  { id: 'gate-c', name: 'Gate C', type: 'gate' },
  { id: 'gate-d', name: 'Gate D', type: 'gate' },
  { id: 'food-court', name: 'Food Court', type: 'amenity' },
  { id: 'stands-north', name: 'Stands North', type: 'stand' },
  { id: 'stands-south', name: 'Stands South', type: 'stand' },
  { id: 'stands-east', name: 'Stands East', type: 'stand' },
  { id: 'stands-west', name: 'Stands West', type: 'stand' },
  { id: 'restroom-1', name: 'Restrooms W', type: 'restroom' },
  { id: 'restroom-2', name: 'Restrooms E', type: 'restroom' },
];

// ─── Queue Items ────────────────────────────────────────────────────────────────
export const QUEUE_ITEMS = [
  { id: 'q1', name: 'Gate A Entry', icon: 'gate', zoneId: 'gate-a' },
  { id: 'q2', name: 'Gate B Entry', icon: 'gate', zoneId: 'gate-b' },
  { id: 'q3', name: 'Gate C Entry', icon: 'gate', zoneId: 'gate-c' },
  { id: 'q4', name: 'Food Stall 1', icon: 'food', zoneId: 'food-court' },
  { id: 'q5', name: 'Food Stall 2', icon: 'food', zoneId: 'food-court' },
  { id: 'q6', name: 'Beverages Bar', icon: 'food', zoneId: 'food-court' },
  { id: 'q7', name: 'Restrooms (West)', icon: 'restroom', zoneId: 'restroom-1' },
  { id: 'q8', name: 'Restrooms (East)', icon: 'restroom', zoneId: 'restroom-2' },
];

// ─── Alert Templates ────────────────────────────────────────────────────────────
const ALERT_TEMPLATES = {
  high: [
    (zone) => ({ severity: 'high', msg: `${zone} is critically overcrowded`, action: 'Avoid this area' }),
    (zone) => ({ severity: 'high', msg: `Dangerous congestion at ${zone}`, action: 'Use alternate route' }),
  ],
  medium: [
    (zone) => ({ severity: 'medium', msg: `${zone} is getting busy`, action: 'Plan ahead' }),
    (zone) => ({ severity: 'medium', msg: `Wait times rising at ${zone}`, action: 'Consider alternatives' }),
  ],
  info: [
    () => ({ severity: 'info', msg: 'Your food order is ready for pickup', action: 'Head to Food Court' }),
    () => ({ severity: 'info', msg: 'Next match segment starts in 10 minutes', action: 'Find your seat now' }),
    () => ({ severity: 'info', msg: 'Parking Zone B is now open', action: 'Use West entrance' }),
  ],
};

// ─── Admin Suggestions ──────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'Open additional lanes at {zone} to reduce congestion',
  'Redirect attendees from {zone} to less crowded areas',
  'Deploy additional staff to {zone} immediately',
  'Activate overflow queue system at {zone}',
  'Announce alternate entry point via PA system for {zone}',
];

// ─── Density Helpers ────────────────────────────────────────────────────────────
export const getDensityLevel = (density) => {
  if (density >= 70) return 'high';
  if (density <= 30) return 'low';
  return 'medium';
};

export const getDensityColor = (density) => {
  if (density >= 70) return '#EF4444';
  if (density <= 30) return '#22C55E';
  return '#F59E0B';
};

export const getDensityGlow = (density) => {
  if (density >= 70) return 'rgba(239,68,68,0.6)';
  if (density <= 30) return 'rgba(34,197,94,0.4)';
  return 'rgba(245,158,11,0.5)';
};

// ─── Main Simulation Generator ──────────────────────────────────────────────────
let tickCount = 0;
const prevDensities = {};

export const generateCrowdData = () => {
  tickCount++;

  // Generate zone densities with smooth drift
  const zones = ZONES.map((zone) => {
    const prev = prevDensities[zone.id] ?? Math.random() * 100;
    const drift = (Math.random() - 0.48) * 18; // slight upward bias
    const raw = Math.max(0, Math.min(100, prev + drift));
    prevDensities[zone.id] = raw;
    const density = Math.round(raw);
    return { ...zone, density, level: getDensityLevel(density) };
  });

  // Queue wait times derived from zone density
  const queues = QUEUE_ITEMS.map((item) => {
    const zone = zones.find((z) => z.id === item.zoneId);
    const density = zone ? zone.density : Math.round(Math.random() * 100);
    const waitTime = Math.max(1, Math.round((density / 100) * 28 + Math.random() * 4));
    return { ...item, density, waitTime, level: getDensityLevel(density) };
  });

  // Generate alerts from high/medium zones
  const alerts = [];
  zones.forEach((zone) => {
    if (zone.level === 'high') {
      const tpl = ALERT_TEMPLATES.high[Math.floor(Math.random() * ALERT_TEMPLATES.high.length)];
      alerts.push({ id: `alert-${zone.id}`, ...tpl(zone.name), zone: zone.name, ts: Date.now() });
    } else if (zone.level === 'medium' && Math.random() > 0.65) {
      const tpl = ALERT_TEMPLATES.medium[Math.floor(Math.random() * ALERT_TEMPLATES.medium.length)];
      alerts.push({ id: `alert-med-${zone.id}`, ...tpl(zone.name), zone: zone.name, ts: Date.now() });
    }
  });

  // Always add 1-2 info alerts
  const infoPool = ALERT_TEMPLATES.info;
  alerts.push({ id: 'info-1', ...infoPool[tickCount % infoPool.length](), ts: Date.now() });

  // Overall status
  const highCount = zones.filter((z) => z.level === 'high').length;
  const overallStatus = highCount >= 3 ? 'High' : highCount >= 1 ? 'Moderate' : 'Low';

  // Admin suggestions for high-risk zones
  const suggestions = zones
    .filter((z) => z.density >= 65)
    .slice(0, 3)
    .map((z) => {
      const tpl = SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)];
      return { zoneId: z.id, zoneName: z.name, text: tpl.replace('{zone}', z.name), density: z.density };
    });

  // Best route: least crowded gate
  const gates = zones.filter((z) => z.type === 'gate');
  const bestGate = gates.reduce((min, g) => (g.density < min.density ? g : min), gates[0]);

  return { zones, queues, alerts, overallStatus, suggestions, bestGate, tick: tickCount };
};
