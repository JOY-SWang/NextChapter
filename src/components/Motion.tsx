import { useEffect, useRef, useState, type CSSProperties, type ElementType, type HTMLAttributes, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';

const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * True once the element has scrolled into view (fires once, then stays true).
 * Works inside the phone's nested scroll container: the implicit-root observer
 * clips the target by every scrolling ancestor.
 */
export function useInView<T extends Element>({ threshold = 0.2, rootMargin = '0px 0px -8% 0px' }: { threshold?: number; rootMargin?: string } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, threshold, rootMargin]);
  return [ref, inView] as const;
}

type RevealVariant = 'up' | 'fade' | 'scale' | 'left';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  /** Stagger delay in ms. */
  delay?: number;
  variant?: RevealVariant;
  threshold?: number;
  type?: 'button' | 'submit';
  children: ReactNode;
}

/** Scroll-triggered entrance: plays once, all the way through, when the element enters the viewport. */
export function Reveal({ as: Tag = 'div', delay = 0, variant = 'up', threshold, className, style, children, ...rest }: RevealProps) {
  const [ref, inView] = useInView<HTMLElement>({ threshold });
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'is-in' : ''} ${className ?? ''}`}
      style={{ ...style, '--rd': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Number that counts up from 0 once it scrolls into view. */
export function CountUp({ to, suffix = '', duration = 1100, delay = 0, className }: { to: number; suffix?: string; duration?: number; delay?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6, rootMargin: '0px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      setVal(to);
      return;
    }
    let raf = 0;
    let start: number | undefined;
    const tick = (now: number) => {
      if (start === undefined) start = now + delay;
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, delay]);
  return (
    <span ref={ref} className={`countup ${className ?? ''}`}>
      <span aria-hidden>
        {val}
        {suffix}
      </span>
      <span className="sr-only">
        {to}
        {suffix}
      </span>
    </span>
  );
}

interface Ripple {
  id: number;
  x: number; // % of host width
  y: number; // % of host height
  size: number; // diameter, % of host width
}

/**
 * Ripple effect — a wave spreads from wherever the button is pressed
 * (from the centre for keyboard presses). Positions are stored as percentages
 * so the effect stays correct under the text-size zoom setting.
 * Spread `handlers` on the host, render `layer` inside it, and give the host the `ripple-host` class.
 */
export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const spawn = (host: HTMLElement, clientX?: number, clientY?: number) => {
    const r = host.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = clientX === undefined ? r.width / 2 : clientX - r.left;
    const py = clientY === undefined ? r.height / 2 : clientY - r.top;
    // Radius = distance to the farthest corner, so the wave always covers the whole button.
    const radius = Math.max(Math.hypot(px, py), Math.hypot(r.width - px, py), Math.hypot(px, r.height - py), Math.hypot(r.width - px, r.height - py));
    const id = nextId.current++;
    setRipples((rs) => [...rs.slice(-3), { id, x: (px / r.width) * 100, y: (py / r.height) * 100, size: ((radius * 2) / r.width) * 100 }]);
    timers.current.push(window.setTimeout(() => setRipples((rs) => rs.filter((rp) => rp.id !== id)), 700));
  };

  const handlers = {
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (e.button === 0) spawn(e.currentTarget, e.clientX, e.clientY);
    },
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) spawn(e.currentTarget);
    },
  };

  const layer = (
    <span className="ripple-layer" aria-hidden>
      {ripples.map((rp) => (
        <span key={rp.id} className="ripple" style={{ left: `${rp.x}%`, top: `${rp.y}%`, width: `${rp.size}%` }} />
      ))}
    </span>
  );

  return { handlers, layer };
}
