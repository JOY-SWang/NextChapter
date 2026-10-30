export interface RadarAxis {
  label: string;
  /** Second label line (e.g. "95%" or "& cueing"). */
  sub?: string;
  value: number; // 0–1, primary series (the user)
  compare?: number; // 0–1, optional second series (role needs)
}

interface Props {
  axes: RadarAxis[];
  radius?: number;
  /** "mastery" colours vertex dots by level (P3); "compare" draws the dashed role polygon (P5). */
  mode?: 'mastery' | 'plain' | 'compare';
  ariaLabel: string;
}

/**
 * Hexagonal radar chart with labels placed outside the grid —
 * recreates the three radar cards (P3 strengths map, P5 fit comparison, User page balance).
 */
export function RadarChart({ axes, radius = 100, mode = 'plain', ariaLabel }: Props) {
  const padX = 52;
  const padY = 36;
  const W = radius * 2 + padX * 2;
  const H = radius * 2 + padY * 2;
  const cx = W / 2;
  const cy = H / 2;
  const n = axes.length;
  const pt = (i: number, r: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  };
  const poly = (vals: number[]) => vals.map((v, i) => pt(i, radius * v).join(',')).join(' ');
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <div className="radar" style={{ width: W, height: H }} role="img" aria-label={ariaLabel}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {rings.map((r, k) => (
          <polygon
            key={r}
            points={poly(axes.map(() => r))}
            fill={k === rings.length - 1 ? 'var(--surface-container-low)' : 'none'}
            stroke="var(--surface-hairline)"
            strokeWidth={1}
            strokeDasharray={mode === 'compare' && k === rings.length - 1 ? '3 3' : undefined}
          />
        ))}
        {axes.map((_, i) => {
          const [x, y] = pt(i, radius);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--surface-hairline)" strokeWidth={1} />;
        })}
        {mode === 'compare' && (
          <polygon
            points={poly(axes.map((a) => a.compare ?? 0))}
            fill="var(--tertiary-key)"
            fillOpacity={0.24}
            stroke="var(--tertiary-key)"
            strokeWidth={2}
            strokeDasharray="5 4"
          />
        )}
        <polygon
          points={poly(axes.map((a) => a.value))}
          fill="var(--primary-key)"
          fillOpacity={mode === 'mastery' ? 0.08 : 0.22}
          stroke="var(--primary-key)"
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        {axes.map((a, i) => {
          const [x, y] = pt(i, radius * a.value);
          const fill = mode === 'mastery' ? (a.value >= 0.85 ? 'var(--secondary-key)' : 'var(--tertiary-key)') : 'var(--primary-key)';
          return <circle key={`d${i}`} cx={x} cy={y} r={mode === 'mastery' ? 5 : 4} fill={fill} stroke="#fff" strokeWidth={1.5} />;
        })}
        {mode === 'compare' &&
          axes.map((a, i) => {
            const [x, y] = pt(i, radius * (a.compare ?? 0));
            return <rect key={`c${i}`} x={x - 4} y={y - 4} width={8} height={8} transform={`rotate(45 ${x} ${y})`} fill="var(--tertiary-key)" />;
          })}
        <circle cx={cx} cy={cy} r={3} fill="var(--on-surface)" />
      </svg>
      {axes.map((a, i) => {
        const [x, y] = pt(i, radius + 24);
        return (
          <div key={a.label} className="radar-label" style={{ left: x, top: y }}>
            <strong>{a.label}</strong>
            {a.sub && <span>{a.sub}</span>}
          </div>
        );
      })}
    </div>
  );
}
