import type { CSSProperties } from 'react';
import { useInView } from './Motion';

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
  /**
   * "mastery" colours vertex dots by level (P3); "compare" draws the dashed role polygon (P5);
   * "edit" draws `compare` as a dashed outline (Joyy's assessment) behind the edited shape.
   */
  mode?: 'mastery' | 'plain' | 'compare' | 'edit';
  /** Scroll-triggered: the shapes grow out from the centre once the chart enters view. */
  animate?: boolean;
  ariaLabel: string;
}

/**
 * Hexagonal radar chart with labels placed outside the grid —
 * recreates the three radar cards (P3 strengths map, P5 fit comparison, User page balance).
 */
export function RadarChart({ axes, radius = 100, mode = 'plain', animate = false, ariaLabel }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 });
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
  const grow = (delay: number) => ({ transformOrigin: `${cx}px ${cy}px`, '--d': `${delay}ms` }) as CSSProperties;

  return (
    <div ref={ref} className={`radar ${animate ? 'radar-anim' : ''} ${animate && inView ? 'is-in' : ''}`} style={{ width: W, height: H }} role="img" aria-label={ariaLabel}>
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
          <g className="radar-shape" style={grow(0)}>
            <polygon
              points={poly(axes.map((a) => a.compare ?? 0))}
              fill="var(--tertiary-key)"
              fillOpacity={0.24}
              stroke="var(--tertiary-key)"
              strokeWidth={2}
              strokeDasharray="5 4"
            />
          </g>
        )}
        {mode === 'edit' && (
          <polygon
            points={poly(axes.map((a) => a.compare ?? a.value))}
            fill="none"
            stroke="var(--outline)"
            strokeWidth={1.6}
            strokeDasharray="4 4"
            strokeLinejoin="round"
          />
        )}
        <g className="radar-shape" style={grow(mode === 'compare' ? 280 : 0)}>
          <polygon
            points={poly(axes.map((a) => a.value))}
            fill="var(--primary-key)"
            fillOpacity={mode === 'mastery' ? 0.08 : 0.22}
            stroke="var(--primary-key)"
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
        </g>
        {axes.map((a, i) => {
          const [x, y] = pt(i, radius * a.value);
          const fill = mode === 'mastery' ? (a.value >= 0.85 ? 'var(--secondary-key)' : 'var(--tertiary-key)') : 'var(--primary-key)';
          return (
            <circle
              key={`d${i}`}
              className="radar-dot"
              style={{ '--i': i } as CSSProperties}
              cx={x}
              cy={y}
              r={mode === 'mastery' ? 5 : 4}
              fill={fill}
              stroke="#fff"
              strokeWidth={1.5}
            />
          );
        })}
        {mode === 'compare' &&
          axes.map((a, i) => {
            const [x, y] = pt(i, radius * (a.compare ?? 0));
            return (
              <g key={`c${i}`} transform={`rotate(45 ${x} ${y})`}>
                <rect className="radar-dot" style={{ '--i': i } as CSSProperties} x={x - 4} y={y - 4} width={8} height={8} fill="var(--tertiary-key)" />
              </g>
            );
          })}
        <circle cx={cx} cy={cy} r={3} fill="var(--on-surface)" />
      </svg>
      {axes.map((a, i) => {
        const [x, y] = pt(i, radius + 24);
        return (
          <div key={a.label} className="radar-label" style={{ left: x, top: y, '--i': i } as CSSProperties}>
            <strong>{a.label}</strong>
            {a.sub && <span>{a.sub}</span>}
          </div>
        );
      })}
    </div>
  );
}
