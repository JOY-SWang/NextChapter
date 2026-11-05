import { useNavigate } from 'react-router-dom';
import { OverlayFrame } from './OverlayFrame';
import { useApp, type OverlayId, type TextSize } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { Joyy, JoyyAvatar, Sparkle } from '../components/Joyy';
import { Photo } from '../components/Photo';
import { Button, Pill, Toggle, TopicChip } from '../components/ui';
import { R } from '../routes';
import { KNOWLEDGE_TOPICS } from '../data/content';
import { EditStrengths } from './EditStrengths';

/* ───────────────────────── Settings drawer (≡) ───────────────────────── */
function SettingsDrawer() {
  const { settings, updateSettings, closeOverlay } = useApp();
  const nav = useNavigate();
  const go = (to: string) => {
    closeOverlay();
    nav(to);
  };
  const sizes: { id: TextSize; label: string; px: number }[] = [
    { id: 'standard', label: 'Standard', px: 14 },
    { id: 'large', label: 'Large', px: 18 },
    { id: 'xl', label: 'Extra large', px: 22 },
  ];
  const current = sizes.find((s) => s.id === settings.textSize)!;
  return (
    <OverlayFrame kind="drawer" label="Menu and display settings">
      <div className="drawer-head">
        <Photo name="sarah" alt="Sarah" round className="drawer-avatar" />
        <div className="grow">
          <div className="t-h3">Sarah Jenkins</div>
          <div className="t-caption muted">Exploring · Yoga teaching</div>
        </div>
        <button type="button" className="icon-btn icon-btn-soft" aria-label="Close menu" onClick={closeOverlay}>
          <Icon name="close" size={20} stroke={2} />
        </button>
      </div>

      <div className="drawer-section">
        <div className="drawer-overline">Display &amp; comfort</div>
        <div className="text-size-card">
          <div className="row-between">
            <span className="t-label-lg">Text size</span>
            <span className="t-label strong-green">{current.label}</span>
          </div>
          <div className="segmented" role="radiogroup" aria-label="Text size">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                role="radio"
                aria-checked={s.id === settings.textSize}
                aria-label={s.label}
                className={`segment ${s.id === settings.textSize ? 'is-on' : ''}`}
                onClick={() => updateSettings({ textSize: s.id })}
              >
                <span style={{ fontSize: s.px }}>A</span>
              </button>
            ))}
          </div>
          <p className="t-caption muted">Applies to every page, including AI Coach replies.</p>
        </div>
        <DrawerRow icon="bold" label="Bold text" right={<Toggle label="Bold text" on={settings.boldText} onChange={(v) => updateSettings({ boldText: v })} />} />
        <DrawerRow icon="contrast" label="High contrast" right={<Toggle label="High contrast" on={settings.highContrast} onChange={(v) => updateSettings({ highContrast: v })} />} />
        <DrawerRow icon="voice" label="Read replies aloud" right={<Toggle label="Read replies aloud" on={settings.readAloud} onChange={(v) => updateSettings({ readAloud: v })} />} />
      </div>

      <div className="drawer-section">
        <div className="drawer-overline">Language</div>
        <DrawerRow icon="globe" label="App language" right={<span className="row-trail">English <Icon name="chevron-right" size={18} /></span>} />
      </div>

      <div className="drawer-section">
        <div className="drawer-overline">My Next Chapter</div>
        <DrawerRow leading={<JoyyAvatar size={24} />} label="Joyy settings" chevron onClick={() => go(R.joyySettings)} />
        <DrawerRow icon="user" label="My profile & strengths" chevron onClick={() => go(R.me)} />
        <DrawerRow icon="bookmark" label="Saved paths" chevron onClick={() => go(R.fit)} />
        <DrawerRow icon="shield" label="Privacy & data" chevron />
      </div>

      <div className="grow" />
      <div className="drawer-foot">
        <button type="button" className="unstyled drawer-foot-btn">
          <Icon name="help" size={20} /> Help &amp; feedback
        </button>
        <button type="button" className="unstyled drawer-foot-btn terracotta" onClick={() => go(R.welcome)}>
          <Icon name="logout" size={20} /> Sign out
        </button>
      </div>
    </OverlayFrame>
  );
}

function DrawerRow({ icon, leading, label, right, chevron, onClick }: { icon?: string; leading?: React.ReactNode; label: string; right?: React.ReactNode; chevron?: boolean; onClick?: () => void }) {
  const content = (
    <>
      {leading ?? <Icon name={icon!} size={20} color="var(--on-surface-variant)" />}
      <span className="grow drawer-row-label">{label}</span>
      {right}
      {chevron && <Icon name="chevron-right" size={18} color="var(--outline)" />}
    </>
  );
  return onClick ? (
    <button type="button" className="unstyled drawer-row" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="drawer-row">{content}</div>
  );
}

/* ───────────────────────── Meet Joyy (intro modal) ───────────────────────── */
function MeetJoyy() {
  const { closeOverlay } = useApp();
  const nav = useNavigate();
  const start = () => {
    closeOverlay();
    nav(R.coachGuide);
  };
  const promises = [
    { icon: 'chat-lines', tone: 'green', title: 'Learn your story', text: 'I get to know your background and goals.' },
    { icon: 'book', tone: 'amber', title: 'Bring relevant knowledge', text: 'I pick resources and tools that fit your journey.' },
    { icon: 'heart', tone: 'terracotta', title: 'Support every step', text: 'No pressure. Go at your own pace.' },
  ] as const;
  return (
    <OverlayFrame kind="modal" label="Meet Joyy, your AI coach">
      <div className="joyy-hero joyy-hero-intro joyy-welcome">
        <span className="mound" />
        <span className="joyy-pop joyy-hero-mascot">
          <Joyy mood="wink" size={174} animated />
        </span>
        <div className="speech speech-soft">
          Hi!
          <br />
          I’m Joyy!
        </div>
        <span className="welcome-spark" style={{ left: 262, top: 40, '--s': 0 } as React.CSSProperties}>
          <Sparkle size={14} />
        </span>
        <span className="welcome-spark" style={{ right: 40, top: 110, '--s': 1 } as React.CSSProperties}>
          <Sparkle size={12} />
        </span>
        <span className="welcome-spark" style={{ left: 132, top: 30, '--s': 2 } as React.CSSProperties}>
          <Sparkle size={10} />
        </span>
        <span className="welcome-spark" style={{ left: 40, top: 150, '--s': 3 } as React.CSSProperties}>
          <Sparkle size={12} />
        </span>
        <button type="button" className="icon-btn icon-btn-white modal-close" aria-label="Close" onClick={closeOverlay}>
          <Icon name="close" size={20} stroke={2} />
        </button>
      </div>
      <div className="modal-body center joyy-welcome-body">
        <h2 className="t-h1-sm stagger" style={{ '--k': 0 } as React.CSSProperties}>
          Your Personal AI Coach for What’s Next
        </h2>
        <p className="t-body-md muted stagger" style={{ '--k': 1 } as React.CSSProperties}>
          I’m here to listen, understand your experience, and help you explore.
        </p>
        <div className="promises">
          {promises.map((p, i) => (
            <div key={p.title} className="promise stagger" style={{ '--k': 2 + i } as React.CSSProperties}>
              <span className={`icon-tile tile-${p.tone}`} style={{ width: 48, height: 48, borderRadius: 14 }}>
                <Icon name={p.icon} size={24} />
              </span>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </div>
          ))}
        </div>
        <Button pill size="lg" trailing="arrow-right" onClick={start} className="stagger" style={{ '--k': 5 } as React.CSSProperties}>
          Let’s Chat, Joyy!
        </Button>
        <button type="button" className="unstyled text-link stagger" style={{ '--k': 6 } as React.CSSProperties} onClick={start}>
          Maybe later
        </button>
      </div>
    </OverlayFrame>
  );
}

/* ───────────────────────── Joyy profile popup ───────────────────────── */
function JoyyProfile() {
  const { closeOverlay } = useApp();
  const nav = useNavigate();
  return (
    <OverlayFrame kind="modal" label="Joyy’s profile">
      <div className="modal-pad">
        <div className="joyy-hero joyy-hero-profile">
          <span className="mound mound-sm" />
          <Joyy mood="heart" size={150} className="joyy-hero-mascot" />
          <div className="speech speech-dark">
            Growing with
            <br />
            your journey
          </div>
          <Sparkle size={12} style={{ position: 'absolute', left: 158, top: 40 }} />
          <button type="button" className="icon-btn icon-btn-white modal-close" aria-label="Close" onClick={closeOverlay}>
            <Icon name="close" size={18} stroke={2} />
          </button>
        </div>
        <div className="row gap-6">
          <h2 className="t-h1-sm">Hi, I’m Joyy!</h2>
          <Sparkle size={20} />
        </div>
        <p className="t-body-md muted">Your personal AI coach for career transitions and a more fulfilling life.</p>
        <div className="card card-card card-outlined knowledge-box">
          <div className="row gap-6">
            <Icon name="brain" size={20} color="var(--tertiary-key)" />
            <span className="t-h4">My Knowledge Focus</span>
            <Icon name="info" size={16} color="var(--outline)" />
          </div>
          <p className="t-caption muted">I pick knowledge and resources that match your background and goals. Add or remove topics anytime.</p>
          <div className="wrap gap-6">
            {KNOWLEDGE_TOPICS.map((t) => (
              <TopicChip key={t.label} label={t.label} tone={t.tone} isNew={t.isNew} />
            ))}
            <TopicChip label="Add topic" add />
          </div>
          <p className="t-tiny muted">New from our chat: yoga practice and wellness interests.</p>
        </div>
        <Button pill size="lg" trailing="arrow-right" onClick={() => (closeOverlay(), nav(R.joyySettings))}>
          Open Joyy Settings
        </Button>
      </div>
    </OverlayFrame>
  );
}

/* ───────────────────────── Plan ready (after P5) ───────────────────────── */
function PlanReady() {
  const { closeOverlay } = useApp();
  const nav = useNavigate();
  return (
    <OverlayFrame kind="modal" label="Your plan is ready">
      <div className="modal-pad center">
        <span className="plan-avatar">
          <JoyyAvatar size={84} />
        </span>
        <Pill tone="green" className="pill-overline">
          A NEW CHAPTER BEGINS
        </Pill>
        <h2 className="t-display-sm">You’ve found a direction worth exploring.</h2>
        <p className="t-body-lg muted">Your experience brought you here. Now let’s turn your interest in yoga teaching into small, meaningful steps.</p>
        <ul className="checklist">
          <li>
            <Icon name="check-circle" size={22} color="var(--primary-key)" /> Your strengths, recognised
          </li>
          <li>
            <Icon name="check-circle" size={22} color="var(--primary-key)" /> Your direction, chosen
          </li>
          <li>
            <Icon name="route" size={22} color="var(--tertiary-key)" /> Your 100-day plan is ready
          </li>
        </ul>
        <Button pill size="lg" trailing="arrow-right" onClick={() => (closeOverlay(), nav(R.home))}>
          Let’s Begin My Journey
        </Button>
        <p className="t-caption outline">Your pace. Your path. Your next chapter.</p>
      </div>
    </OverlayFrame>
  );
}

/* ───────────────────────── Add to My Day sheets ───────────────────────── */
const SHEETS = {
  rsvp: {
    title: 'You’re going!',
    icon: 'people',
    tone: 'terracotta',
    event: 'Peer Circle Gathering',
    meta: 'Thu 5 Nov · 7:00 PM · Online coffee chat',
    supports: 'Supports Stage 1 · Explore & Validate',
    question: 'Would you like to add this gathering to My Day?',
  },
  chatBooked: {
    title: 'Chat booked with Elena',
    icon: 'video',
    tone: 'green',
    event: '30-min chat with Elena Rostova',
    meta: 'Fri 6 Nov · 10:00 AM · Video call · Free',
    supports: 'Completes your Roadmap Next Action',
    question: 'Would you like to add this chat to My Day? Joyy will remind you to prepare your questions.',
  },
  trialClass: {
    title: 'Trial class booked!',
    icon: 'lotus',
    tone: 'terracotta',
    event: 'Beginner Yoga Class',
    meta: 'Sat 7 Nov · 9:00 AM · Lotus Bloom Studio · 45 min',
    supports: 'Supports Stage 1 · Attend 2 trial classes',
    question: 'Would you like to add this class to My Day?',
  },
} as const;

function AddToMyDay({ id }: { id: keyof typeof SHEETS }) {
  const s = SHEETS[id];
  const { closeOverlay, addToMyDay } = useApp();
  return (
    <OverlayFrame kind="sheet" label={s.title}>
      <span className="grabber" />
      <span className="success-icon">
        <Icon name="check" size={28} stroke={2.6} color="var(--primary-key)" />
      </span>
      <h2 className="t-h1-sm center">{s.title}</h2>
      <div className="sheet-event">
        <span className={`icon-tile tile-${s.tone}`} style={{ width: 44, height: 44, borderRadius: 14 }}>
          <Icon name={s.icon} size={22} />
        </span>
        <div className="grow stack-4">
          <strong className="t-label-lg">{s.event}</strong>
          <span className="t-caption muted">{s.meta}</span>
          <Pill tone="green" icon="milestone">
            {s.supports}
          </Pill>
        </div>
      </div>
      <p className="t-body-md muted center">{s.question}</p>
      <Button pill size="lg" icon="calendar" onClick={() => (addToMyDay(id), closeOverlay())}>
        Add to My Day
      </Button>
      <button type="button" className="unstyled text-link no-underline" onClick={closeOverlay}>
        Not now
      </button>
    </OverlayFrame>
  );
}

/** Renders whichever overlay is open (one at a time, like Figma's "Open overlay"). */
export function OverlayHost() {
  const { overlay } = useApp();
  const map: Record<OverlayId, React.ReactNode> = {
    drawer: <SettingsDrawer />,
    meetJoyy: <MeetJoyy />,
    joyyProfile: <JoyyProfile />,
    planReady: <PlanReady />,
    rsvp: <AddToMyDay id="rsvp" />,
    chatBooked: <AddToMyDay id="chatBooked" />,
    trialClass: <AddToMyDay id="trialClass" />,
    editStrengths: <EditStrengths />,
  };
  return overlay ? <>{map[overlay]}</> : null;
}
