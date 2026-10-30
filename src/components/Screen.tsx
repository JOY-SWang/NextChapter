import type { ReactNode } from 'react';
import { BottomNav, HomeIndicator, StatusBar, TopBar, type Tab, type TopBarState } from './Chrome';
import { useApp } from '../context/AppContext';

interface Props {
  /** Top bar state, or 'status' for screens that only show the iPhone status bar (P1, Joyy Settings). */
  top?: TopBarState | 'status';
  /** Active tab — omit for first-time-journey screens that have no tab bar. */
  tab?: Tab;
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
export function Screen({ top = 'default', tab, dock, children, contentClassName, label }: Props) {
  const { settings } = useApp();
  const hasNav = tab !== undefined;
  const classes = [
    'screen',
    hasNav ? 'has-nav' : 'no-nav',
    top === 'status' ? 'top-status' : 'top-bar-on',
    dock ? 'has-dock' : '',
    `ts-${settings.textSize}`,
    settings.boldText ? 'bold-text' : '',
  ].join(' ');
  return (
    <div className={classes} aria-label={label}>
      <main className="screen-scroll">
        <div className={`screen-content ${contentClassName ?? ''}`}>{children}</div>
      </main>
      {top === 'status' ? <StatusBar solid /> : <TopBar state={top} />}
      {dock && <div className="dock">{dock}</div>}
      {hasNav ? <BottomNav active={tab ?? null} /> : <HomeIndicator />}
    </div>
  );
}
