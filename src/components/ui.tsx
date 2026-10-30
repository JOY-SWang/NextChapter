import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

type BtnVariant = 'primary' | 'strong' | 'terracotta' | 'soft' | 'outline' | 'ghost' | 'onDark' | 'light' | 'glass';

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  icon?: string;
  trailing?: string;
  pill?: boolean;
  size?: 'md' | 'lg' | 'sm';
  block?: boolean;
}

/** Buttons — primary (forest), strong (deep forest), terracotta, soft (surface), outline, ghost. */
export function Button({ variant = 'primary', icon, trailing, pill, size = 'md', block = true, className, children, ...rest }: BtnProps) {
  const cls = ['btn', `btn-${variant}`, `btn-${size}`, pill ? 'btn-pill' : '', block ? 'btn-block' : '', className ?? ''].join(' ');
  return (
    <button type="button" className={cls} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      <span>{children}</span>
      {trailing && <Icon name={trailing} size={size === 'sm' ? 15 : 18} stroke={2} />}
    </button>
  );
}

type Tone = 'neutral' | 'green' | 'amber' | 'terracotta' | 'terracotta-solid' | 'dark' | 'outline' | 'white';

/** Small pill label (fit %, status, tags). */
export function Pill({ tone = 'neutral', icon, children, className, style }: { tone?: Tone; icon?: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={`pill pill-${tone} ${className ?? ''}`} style={style}>
      {icon && <Icon name={icon} size={13} stroke={2} />}
      {children}
    </span>
  );
}

/** Removable / addable topic chip (Joyy knowledge focus). */
export function TopicChip({ label, tone = 'green', isNew, add }: { label: string; tone?: Tone; isNew?: boolean; add?: boolean }) {
  return (
    <span className={`topic topic-${add ? 'add' : tone}`}>
      {add && <Icon name="plus" size={14} stroke={2} />}
      <span>{label}</span>
      {isNew && <span className="new-badge">NEW</span>}
      {!add && <Icon name="close" size={13} stroke={2} />}
    </span>
  );
}

export function Card({ children, className, tone = 'card', style, as = 'section' }: { children: ReactNode; className?: string; tone?: 'card' | 'low' | 'mid' | 'high' | 'dark' | 'outlined'; style?: CSSProperties; as?: 'section' | 'div' | 'article' }) {
  const Tag = as;
  return (
    <Tag className={`card card-${tone} ${className ?? ''}`} style={style}>
      {children}
    </Tag>
  );
}

export function Overline({ children, color, icon, style }: { children: ReactNode; color?: string; icon?: string; style?: CSSProperties }) {
  return (
    <div className="overline" style={{ color, ...style }}>
      {icon && <Icon name={icon} size={15} stroke={1.9} />}
      {children}
    </div>
  );
}

export function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className={`toggle ${on ? 'toggle-on' : ''}`} onClick={() => onChange(!on)}>
      <span className="toggle-knob" />
    </button>
  );
}

export function ProgressBar({ value, height = 6, tone = 'green', track = 'var(--surface-container)' }: { value: number; height?: number; tone?: 'green' | 'amber'; track?: string }) {
  return (
    <div className="progress" style={{ height, background: track }} role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100}>
      <span style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: tone === 'green' ? 'var(--primary-key)' : 'var(--secondary-key)' }} />
    </div>
  );
}

/** Circular progress (Roadmap "12% Progress"). */
export function ProgressRing({ value, size = 64 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-hairline)" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--secondary-key)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${c * value} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export function IconTile({ icon, tone = 'green', size = 44, radius = 14, iconSize = 22 }: { icon: string; tone?: 'green' | 'amber' | 'terracotta' | 'neutral' | 'dark'; size?: number; radius?: number; iconSize?: number }) {
  return (
    <span className={`icon-tile tile-${tone}`} style={{ width: size, height: size, borderRadius: radius }}>
      <Icon name={icon} size={iconSize} />
    </span>
  );
}

/** Horizontally scrolling filter chips (visual only, first one selected). */
export function FilterChips({ items, active = 0, onSelect }: { items: string[]; active?: number; onSelect?: (i: number) => void }) {
  return (
    <div className="filter-row" role="tablist">
      {items.map((label, i) => (
        <button key={label} type="button" role="tab" aria-selected={i === active} className={`filter-chip ${i === active ? 'is-active' : ''}`} onClick={() => onSelect?.(i)}>
          {label}
        </button>
      ))}
    </div>
  );
}
