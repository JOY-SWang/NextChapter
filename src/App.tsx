import { HashRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider, useApp, type OverlayId } from './context/AppContext';
import { OverlayHost } from './overlays/Overlays';
import { R, SCREEN_MAP } from './routes';
import { Welcome } from './screens/Welcome';
import { Home } from './screens/Home';
import { Coach } from './screens/Coach';
import { Strengths } from './screens/Strengths';
import { Possibilities } from './screens/Possibilities';
import { Fit } from './screens/Fit';
import { Discover } from './screens/Discover';
import { Roadmap } from './screens/Roadmap';
import { Community } from './screens/Community';
import { Me } from './screens/Me';
import { Messages } from './screens/Messages';
import { JoyAISettings } from './screens/JoyAISettings';

const OVERLAY_LINKS: { label: string; id: OverlayId }[] = [
  { label: 'Settings drawer (≡)', id: 'drawer' },
  { label: 'Meet JoyAI', id: 'meetJoyAI' },
  { label: 'JoyAI profile', id: 'joyaiProfile' },
  { label: 'Plan ready', id: 'planReady' },
  { label: 'RSVP confirmed', id: 'rsvp' },
  { label: 'Chat booked', id: 'chatBooked' },
  { label: 'Trial class booked', id: 'trialClass' },
];

/** Side panel shown on wide screens: jump to any Figma frame or overlay. */
function PrototypeMap() {
  const { openOverlay } = useApp();
  return (
    <aside className="proto-map" aria-label="Prototype map">
      <div className="proto-brand">
        <span className="proto-logo" aria-hidden>
          <svg viewBox="0 0 32 32" width="28" height="28">
            <rect width="32" height="32" rx="8" fill="#1E382B" />
            <g fill="none" stroke="#CBEAD7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 25v-9" />
              <path d="M16 16c0-4.4-3.2-7.6-8-7.6 0 4.4 3.2 7.6 8 7.6z" />
              <path d="M16 14c0-3.9 2.7-7 7.6-7 0 3.9-2.7 7-7.6 7z" />
            </g>
          </svg>
        </span>
        <div>
          <strong>Next Chapter</strong>
          <span>Web prototype · from Figma</span>
        </div>
      </div>
      {SCREEN_MAP.map((g) => (
        <nav key={g.group} className="proto-group">
          <h2>{g.group}</h2>
          {g.items.map((i) => (
            <NavLink key={i.to} to={i.to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <span>{i.label}</span>
              <small>{i.figma}</small>
            </NavLink>
          ))}
        </nav>
      ))}
      <div className="proto-group">
        <h2>Overlays</h2>
        {OVERLAY_LINKS.map((o) => (
          <button key={o.id} type="button" onClick={() => openOverlay(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      <p className="proto-note">Tip: on a phone the prototype fills the screen. Use the in-app buttons, tabs and top bar to move around — they follow the Figma prototype links.</p>
    </aside>
  );
}

function Device() {
  const { settings, closeOverlay } = useApp();
  const loc = useLocation();
  // Close any overlay when the route changes (overlays navigate before closing).
  useEffect(() => closeOverlay(), [loc.pathname, closeOverlay]);
  return (
    <div className={`device ${settings.highContrast ? 'hc' : ''}`}>
      <span className="device-island" aria-hidden />
      <Routes>
        {/* Opening the site (no hash) always starts at P1 - Welcome. */}
        <Route path="/" element={<Navigate to={R.welcome} replace />} />
        <Route path={R.welcome} element={<Welcome />} />
        <Route path={R.home} element={<Home />} />
        <Route path={R.coachGuide} element={<Coach key="guided" guiding />} />
        <Route path={R.coach} element={<Coach key="everyday" />} />
        <Route path={R.strengths} element={<Strengths />} />
        <Route path={R.possibilities} element={<Possibilities />} />
        <Route path={R.fit} element={<Fit />} />
        <Route path={R.discover} element={<Discover />} />
        <Route path={R.roadmap} element={<Roadmap />} />
        <Route path={R.community} element={<Community />} />
        <Route path={R.me} element={<Me />} />
        <Route path={R.messages} element={<Messages />} />
        <Route path={R.joyaiSettings} element={<JoyAISettings />} />
        <Route path="*" element={<Navigate to={R.welcome} replace />} />
      </Routes>
      <OverlayHost />
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <div className="stage">
          <PrototypeMap />
          <Device />
        </div>
      </AppProvider>
    </HashRouter>
  );
}
