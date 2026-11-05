import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { Photo } from './Photo';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

/** iPhone status bar (Dynamic Island safe area). Hidden on real phones via CSS. */
export function StatusBar({ solid }: { solid?: boolean }) {
  return (
    <div className={`status-bar ${solid ? 'status-bar-solid' : ''}`} aria-hidden>
      <span className="status-time">9:41</span>
      <svg width="72" height="14" viewBox="0 0 72 14">
        <rect x="0" y="9" width="3" height="4" rx="1" fill="currentColor" />
        <rect x="5" y="6.5" width="3" height="6.5" rx="1" fill="currentColor" />
        <rect x="10" y="4" width="3" height="9" rx="1" fill="currentColor" />
        <rect x="15" y="1.5" width="3" height="11.5" rx="1" fill="currentColor" />
        <path d="M28 5.2a9 9 0 0 1 12 0M30.4 7.8a5.5 5.5 0 0 1 7.2 0M32.8 10.4a2 2 0 0 1 2.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <rect x="46.5" y="1.5" width="22" height="11" rx="3.2" stroke="currentColor" strokeOpacity="0.4" fill="none" />
        <rect x="48.5" y="3.5" width="18" height="7" rx="1.8" fill="currentColor" />
        <rect x="70" y="5" width="1.6" height="4" rx="0.8" fill="currentColor" fillOpacity="0.4" />
      </svg>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="home-indicator" aria-hidden>
      <span />
    </div>
  );
}

export type TopBarState = 'default' | 'profile' | 'messages';

/** NC / Top App Bar — ≡ opens the settings drawer, 💬 opens Messages, avatar opens the Me page. */
export function TopBar({ state = 'default' }: { state?: TopBarState }) {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  return (
    <header className="top-bar">
      <StatusBar />
      <div className="top-bar-row">
        <div className="top-bar-side">
          <button type="button" className="icon-btn icon-btn-soft" aria-label="Open menu and display settings" onClick={() => openOverlay('drawer')}>
            <Icon name="menu" size={18} color="var(--on-surface)" />
          </button>
        </div>
        <div className="top-bar-brand">Next Chapter</div>
        <div className="top-bar-side top-bar-right">
          <button
            type="button"
            className={`icon-btn ${state === 'messages' ? 'icon-btn-active' : ''}`}
            aria-label="Messages (1 unread)"
            aria-current={state === 'messages' ? 'page' : undefined}
            onClick={() => nav(R.messages)}
          >
            <Icon name="chat" size={22} />
            {state !== 'messages' && <span className="unread-dot" />}
          </button>
          <button
            type="button"
            className={`avatar-btn ${state === 'profile' ? 'avatar-btn-active' : ''}`}
            aria-label="My profile"
            aria-current={state === 'profile' ? 'page' : undefined}
            onClick={() => nav(R.me)}
          >
            <Photo name="sarah" alt="Sarah" round />
          </button>
        </div>
      </div>
    </header>
  );
}

export type Tab = 'home' | 'discover' | 'coach' | 'roadmap' | 'community' | null;

/**
 * Home · Discover · AI Coach · Roadmap · Community.
 * AI Coach (JoyAI) is always tinted sage so the coach stays easy to find; the active tab is a
 * forest-green pill with a white icon and label.
 */
const TABS: { id: Exclude<Tab, null>; label: string; icon: string; to: string }[] = [
  { id: 'home', label: 'Home', icon: 'nav-home', to: R.home },
  // After a job has been chosen, Discover always opens P4.2 (Explore Your Next Steps).
  { id: 'discover', label: 'Discover', icon: 'nav-discover', to: R.discover },
  { id: 'coach', label: 'AI Coach', icon: 'nav-joyai', to: R.coach },
  { id: 'roadmap', label: 'Roadmap', icon: 'nav-roadmap', to: R.roadmap },
  { id: 'community', label: 'Community', icon: 'nav-people', to: R.community },
];

/** NC / Bottom Nav. */
export function BottomNav({ active }: { active: Tab }) {
  const nav = useNavigate();
  return (
    <nav className="bottom-nav" aria-label="Main">
      <div className="bottom-nav-row">
        {TABS.map((t) => {
          const on = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              className={`tab tab-${t.id} ${on ? 'tab-active' : ''}`}
              aria-current={on ? 'page' : undefined}
              onClick={() => nav(t.to)}
            >
              <span className="tab-icon">
                <Icon name={t.icon} size={t.id === 'coach' ? 30 : 24} stroke={on ? 2 : 1.8} />
              </span>
              <span className="tab-label">{t.label}</span>
            </button>
          );
        })}
      </div>
      <HomeIndicator />
    </nav>
  );
}
