import { useRef, type ReactNode } from 'react';
import { BottomNav, HomeIndicator, StatusBar, TopBar, type Tab, type TopBarState } from './Chrome';
import { JourneyCompact, JourneySteps, useJourneyCollapse, type JourneyStep } from './JourneySteps';
import { useApp } from '../context/AppContext';

interface Props {
  /** Top bar state, or 'status' for screens that only show the iPhone status bar (P1, JoyAI Settings). */
  top?: TopBarState | 'status';
  /** Active tab — omit for first-time-journey screens that have no tab bar. */
  tab?: Tab;
  /** Discovery-journey step (P2–P5): expanded stepper at the top that collapses into a pinned compact stepper on scroll. */
  journey?: JourneyStep;
  /** Fixed element pinned above the tab bar / home indicator (e.g. chat input). */
  dock?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  label: string;
}

/**
 * One phone screen: fixed top bar + scrolling content + fixed bottom nav.
 * Mirrors the Figma frames (390×844 viewport, vertical scroll, fixed children).
 */
export function Screen({ top = 'default', tab, journey, dock, children, contentClassName, label }: Props) {
  const { settings } = useApp();
  const screenRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLElement>(null);
  const stepperRef = useRef<HTMLOListElement>(null);
  const compact = useJourneyCollapse(journey !== undefined && top !== 'status', { screen: screenRef, scroller: scrollRef, stepper: stepperRef });

  const hasNav = tab !== undefined;
  const classes = [
    'screen',
    hasNav ? 'has-nav' : 'no-nav',
    top === 'status' ? 'top-status' : 'top-bar-on',
    dock ? 'has-dock' : '',
    journey ? 'has-journey' : '',
    journey && compact ? 'is-journey-compact' : '',
    `ts-${settings.textSize}`,
    settings.boldText ? 'bold-text' : '',
  ].join(' ');
  return (
    <div ref={screenRef} className={classes} aria-label={label}>
      <main ref={scrollRef} className="screen-scroll">
        <div className={`screen-content ${contentClassName ?? ''}`}>
          {journey && <JourneySteps ref={stepperRef} current={journey} />}
          {children}
        </div>
      </main>
      {top === 'status' ? <StatusBar solid /> : <TopBar state={top} />}
      {journey && top !== 'status' && <JourneyCompact current={journey} visible={compact} />}
      {dock && <div className="dock">{dock}</div>}
      {hasNav ? <BottomNav active={tab ?? null} /> : <HomeIndicator />}
    </div>
  );
}
