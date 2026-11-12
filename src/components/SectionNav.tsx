import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

/** Space left between the pinned bar and the section it scrolls to (the page's 16 px rhythm). */
const LANDING_GAP = 16;
/** A section becomes current once its top comes within this distance of where a tap would land it. */
const SPY_SLACK = 80;
/** A tap-triggered scroll counts as finished once no scroll event has fired for this long. */
const SETTLE_MS = 150;

const prefersReducedMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export interface SectionNavState<T extends string> {
  /** The sticky wrapper (`.section-nav`); its first child is the visible pill bar. */
  barRef: RefObject<HTMLDivElement>;
  /** Ref for each section element. The first id is the top of the page. */
  sectionRef: (id: T) => (el: HTMLElement | null) => void;
  active: T;
  /** True while the bar is pinned to the top of the screen. */
  stuck: boolean;
  go: (id: T) => void;
}

/**
 * In-page section navigation for a phone screen. It works inside the screen's own scroll container
 * (`.screen-scroll`), not the window:
 * - `go(id)` smooth-scrolls so the section lands just under the pinned bar, and moves focus there;
 * - while the user scrolls, `active` follows the section in view (scroll-spy);
 * - `stuck` tells whether the bar is pinned (it gets a backdrop then).
 * `ids` must be stable (a module-level constant).
 */
export function useSectionNav<T extends string>(ids: readonly T[]): SectionNavState<T> {
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const barRef = useRef<HTMLDivElement>(null);
  const sections = useRef(new Map<T, HTMLElement>());
  const refCallbacks = useRef(new Map<T, (el: HTMLElement | null) => void>());
  const [active, setActive] = useState<T>(ids[0]);
  const [stuck, setStuck] = useState(false);
  // While a tap-triggered scroll runs, scroll-spy pauses (holds a timer id) so the highlight
  // doesn't flicker through the sections in between.
  const lock = useRef<number | null>(null);
  const raf = useRef(0);

  const sectionRef = useCallback((id: T) => {
    let cb = refCallbacks.current.get(id);
    if (!cb) {
      cb = (el: HTMLElement | null) => {
        if (el) sections.current.set(id, el);
        else sections.current.delete(id);
      };
      refCallbacks.current.set(id, cb);
    }
    return cb;
  }, []);

  /** The scroll container, its top edge, and how far below that edge the bar's pills end once pinned. */
  const geometry = useCallback(() => {
    const bar = barRef.current;
    const pills = bar?.firstElementChild;
    const scroller = bar?.closest<HTMLElement>('.screen-scroll');
    if (!bar || !pills || !scroller) return null;
    const top = scroller.getBoundingClientRect().top;
    const barTop = bar.getBoundingClientRect().top;
    // The bar sticks at `top: 0`, so its pills always end this far below its own top edge.
    return { scroller, top, barTop: barTop - top, pinnedBottom: pills.getBoundingClientRect().bottom - barTop };
  }, []);

  const measure = useCallback(() => {
    const g = geometry();
    if (!g) return;
    const { scroller } = g;
    setStuck(scroller.scrollTop > 0 && g.barTop < 1);
    if (lock.current !== null) return;
    const order = idsRef.current;
    const line = g.top + g.pinnedBottom + LANDING_GAP + SPY_SLACK;
    let current = order[0];
    for (const id of order.slice(1)) {
      const el = sections.current.get(id);
      if (el && el.getBoundingClientRect().top <= line) current = id;
    }
    // At the very bottom the last section wins, even if it can't scroll up to the line.
    if (scroller.scrollTop > 0 && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2) current = order[order.length - 1];
    setActive(current);
  }, [geometry]);

  const schedule = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      measure();
    });
  }, [measure]);

  const release = useCallback(() => {
    if (lock.current !== null) window.clearTimeout(lock.current);
    lock.current = null;
    schedule();
  }, [schedule]);

  useEffect(() => {
    const scroller = barRef.current?.closest<HTMLElement>('.screen-scroll');
    if (!scroller) return;
    const onScroll = () => {
      if (lock.current !== null) {
        window.clearTimeout(lock.current);
        lock.current = window.setTimeout(release, SETTLE_MS);
      }
      schedule();
    };
    // The user took over (wheel, touch, keys): follow them straight away.
    const onTakeOver = () => {
      if (lock.current !== null) release();
    };
    measure();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    scroller.addEventListener('wheel', onTakeOver, { passive: true });
    scroller.addEventListener('touchstart', onTakeOver, { passive: true });
    scroller.addEventListener('keydown', onTakeOver);
    window.addEventListener('resize', schedule);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      scroller.removeEventListener('wheel', onTakeOver);
      scroller.removeEventListener('touchstart', onTakeOver);
      scroller.removeEventListener('keydown', onTakeOver);
      window.removeEventListener('resize', schedule);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
      if (lock.current !== null) window.clearTimeout(lock.current);
      lock.current = null;
    };
  }, [measure, schedule, release]);

  const go = useCallback(
    (id: T) => {
      const g = geometry();
      const el = sections.current.get(id);
      if (!g || !el) return;
      const { scroller } = g;
      const target = id === idsRef.current[0] ? 0 : scroller.scrollTop + el.getBoundingClientRect().top - g.top - g.pinnedBottom - LANDING_GAP;
      const top = Math.round(Math.max(0, Math.min(scroller.scrollHeight - scroller.clientHeight, target)));
      if (lock.current !== null) window.clearTimeout(lock.current);
      lock.current = window.setTimeout(release, 400); // shortened to SETTLE_MS by the first scroll event
      setActive(id);
      scroller.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      // Move focus along with the view (without scrolling again), so keyboard and screen-reader users land there too.
      el.querySelector<HTMLElement>('[data-section-title]')?.focus({ preventScroll: true });
    },
    [geometry, release],
  );

  return { barRef, sectionRef, active, stuck, go };
}

/** The pill bar for `useSectionNav`: pinned under the status bar, highlights the section in view. */
export function SectionNav<T extends string>({ nav, items, label }: { nav: SectionNavState<T>; items: readonly { id: T; label: string }[]; label: string }) {
  const listRef = useRef<HTMLElement>(null);
  // On very narrow screens (or with extra-large text) the bar scrolls sideways: keep the current item in view.
  useEffect(() => {
    const list = listRef.current;
    const btn = list?.querySelector<HTMLElement>('[aria-current]');
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: btn.offsetLeft - (list.clientWidth - btn.offsetWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [nav.active]);

  return (
    <div ref={nav.barRef} className={`section-nav ${nav.stuck ? 'is-stuck' : ''}`}>
      <nav ref={listRef} className="seg-tabs pill-tabs" aria-label={label}>
        {items.map((s) => {
          const on = s.id === nav.active;
          return (
            <button key={s.id} type="button" className={on ? 'is-on' : ''} aria-current={on ? 'location' : undefined} onClick={() => nav.go(s.id)}>
              {s.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
