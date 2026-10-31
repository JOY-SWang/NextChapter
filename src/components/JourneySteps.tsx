import { forwardRef, useEffect, useState, type RefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { R } from '../routes';

export type JourneyStep = 1 | 2 | 3;

const STEPS = [
  { label: 'Your Story', to: R.coachGuide },
  { label: 'Your Strengths', to: R.strengths },
  { label: 'Your Possibilities', to: R.possibilities },
];

const stateOf = (idx: number, current: number) => (idx < current ? 'done' : idx === current ? 'current' : 'upcoming');

/**
 * NC / Journey Steps — expanded state (top of the page):
 * numbered dots joined by a line, inside a soft card. Scrolls with the content.
 */
export const JourneySteps = forwardRef<HTMLOListElement, { current: JourneyStep }>(function JourneySteps({ current }, ref) {
  const nav = useNavigate();
  return (
    <ol ref={ref} className="journey journey-card" aria-label={`Discovery journey, step ${current} of 3`}>
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const state = stateOf(idx, current);
        const clickable = idx <= current;
        return (
          <li key={s.label} className={`journey-step is-${state}`}>
            <button
              type="button"
              className="unstyled journey-btn"
              disabled={!clickable}
              onClick={() => clickable && idx !== current && nav(s.to)}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="journey-dot">{state === 'done' ? <Icon name="check" size={17} stroke={2.4} /> : idx}</span>
              <span className="journey-label">{s.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
});

/**
 * NC / Journey Steps — compact state: a text stepper pinned under the top bar
 * once the expanded card has scrolled away.
 */
export function JourneyCompact({ current, visible }: { current: JourneyStep; visible: boolean }) {
  const nav = useNavigate();
  return (
    <nav className="journey-compact" aria-label="Discovery journey" aria-hidden={!visible}>
      <ol className="jc-list">
        {STEPS.map((s, i) => {
          const idx = i + 1;
          const state = stateOf(idx, current);
          const clickable = idx <= current;
          return (
            <li key={s.label} className={`jc-item is-${state}`}>
              <button
                type="button"
                className="unstyled jc-btn"
                disabled={!clickable}
                tabIndex={visible ? 0 : -1}
                onClick={() => clickable && idx !== current && nav(s.to)}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                {s.label}
              </button>
              {idx < 3 && <Icon name="chevron-right" size={15} stroke={2} className="jc-chev" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Drives the expanded → compact transition from the scroll position.
 * Writes the collapse progress (0–1) to `--jc` on the screen element (used to fade the
 * expanded card) and returns whether the compact stepper should be shown.
 */
export function useJourneyCollapse(
  enabled: boolean,
  refs: { screen: RefObject<HTMLElement>; scroller: RefObject<HTMLElement>; stepper: RefObject<HTMLElement> },
) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const screen = refs.screen.current;
    const scroller = refs.scroller.current;
    if (!enabled || !screen || !scroller) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const stepper = refs.stepper.current;
      const topBar = screen.querySelector<HTMLElement>('.top-bar');
      if (!stepper || !topBar) return;
      const chromeBottom = topBar.getBoundingClientRect().bottom;
      const r = stepper.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (chromeBottom - r.top) / Math.max(1, r.height)));
      screen.style.setProperty('--jc', t.toFixed(3));
      setCompact(t > 0.55);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, refs.screen, refs.scroller, refs.stepper]);
  return compact;
}
