import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { useRipple } from '../components/Motion';
import { JoyyAvatar } from '../components/Joyy';
import { Photo } from '../components/Photo';
import { Button, Pill } from '../components/ui';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

function JoyyTurn({ children }: { children: React.ReactNode }) {
  const { openOverlay } = useApp();
  return (
    <div className="turn turn-joyy">
      <JoyyAvatar size={34} onClick={() => openOverlay('joyyProfile')} />
      <div className="turn-body">
        <span className="turn-name">Joyy</span>
        <div className="bubble bubble-joyy">{children}</div>
      </div>
    </div>
  );
}

function SarahTurn({ children }: { children: React.ReactNode }) {
  return (
    <div className="turn turn-user">
      <div className="turn-body">
        <span className="turn-name">Sarah</span>
        <div className="bubble bubble-user">{children}</div>
      </div>
      <Photo name="sarah" alt="Sarah" round className="turn-avatar" />
    </div>
  );
}

const SOFAR = [
  ['people', 'Leadership & Mentoring'],
  ['chat-lines', 'Communication & Facilitation'],
  ['layers', 'Project Planning'],
  ['refresh', 'Adaptability'],
] as const;

/**
 * "Strengths so far" — expand / collapse. The body animates its height,
 * so the conversation below slides up or down to make room.
 */
function StrengthsSoFar({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyId = useId();
  return (
    <section className={`card card-card strengths-sofar ${open ? 'is-open' : ''}`}>
      <span className="glow" aria-hidden />
      <button type="button" className="unstyled sofar-head" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
        <span className="row gap-8">
          <span className="mini-icon mini-dark">
            <Icon name="sparkle" size={12} color="var(--primary-container)" />
          </span>
          <span className="t-h3">Strengths so far</span>
        </span>
        <span className="row gap-8">
          <Pill tone="terracotta">20 yrs in tech</Pill>
          <span className="sofar-chev" aria-hidden>
            <Icon name="chevron-down" size={18} stroke={2} />
          </span>
        </span>
      </button>
      <div id={bodyId} className="collapse" role="region" aria-label="Strengths so far">
        <div className="collapse-inner">
          <p className="t-quote-md">“What have you already built, and where could it take you next?”</p>
          <div className="wrap gap-8">
            {SOFAR.map(([i, t], k) => (
              <Pill key={t} tone="neutral" icon={i} style={{ '--i': k } as React.CSSProperties}>
                {t}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Joyy's "thinking" bubble: sparkle + label + three looping dots. */
function ThinkingTurn() {
  const { openOverlay } = useApp();
  return (
    <div className="turn turn-joyy turn-enter" role="status" aria-label="Joyy is thinking">
      <JoyyAvatar size={34} onClick={() => openOverlay('joyyProfile')} />
      <div className="turn-body">
        <span className="turn-name">Joyy</span>
        <div className="bubble bubble-joyy bubble-thinking">
          <Icon name="sparkle" size={18} color="var(--primary-key)" className="thinking-spark" />
          <span>Joyy is thinking</span>
          <span className="thinking-dots" aria-hidden>
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
    </div>
  );
}

type ChatMsg = { id: number; from: 'sarah' | 'joyy'; text: string };

/**
 * Simulated replies — Joyy picks relevant knowledge and resources for Sarah's goals;
 * it does not claim to have learned a new profession.
 */
function simulatedReply(text: string) {
  const t = text.toLowerCase();
  if (/yoga|teach|class|studio|ryt/.test(t))
    return 'Good question. For yoga teaching, a gentle first step is trying two beginner classes and talking with a working instructor — it shows you what the role is really like before you commit to training. Want me to add that to your plan?';
  if (/time|hour|week|busy|tired|energy/.test(t))
    return 'Let’s protect your energy. We can keep this to about 8 hours a week and move things around whenever life gets full. Which days usually feel lightest for you?';
  if (/money|income|pay|cost|afford|price/.test(t))
    return 'That matters. I can pull together typical costs and earnings for the paths you’re considering, so you can compare them side by side. Should I start with yoga teaching or mentoring?';
  if (/mentor|coach|help people|career/.test(t))
    return 'Your 20 years of mentoring carry straight into this. I can suggest a few ways to start small — like one pro-bono mentoring session a month — to see how it feels.';
  if (/scared|afraid|worried|nervous|unsure|doubt/.test(t))
    return 'It’s completely normal to feel that way. Nothing here is a commitment — we’re only testing small steps so you can decide with real experience. What feels most uncertain right now?';
  return 'Thanks for sharing that, Sarah. I’ll keep it in mind as I suggest next steps. What would you like to explore next — your strengths, possible paths, or how to fit this into your week?';
}

/**
 * Chat UI interaction + simulated AI thinking:
 * send → Sarah's bubble appears → after 100 ms Joyy's thinking bubble (looping dots)
 * → after a short "thinking" pause it is replaced by Joyy's reply.
 */
function useSimulatedChat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [thinking, setThinking] = useState(false);
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const nextId = useRef(0);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  useEffect(() => {
    if (messages.length || thinking) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, thinking]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return false;
    setBusy(true);
    setMessages((m) => [...m, { id: nextId.current++, from: 'sarah', text }]);
    later(() => setThinking(true), 100);
    const thinkFor = 1500 + Math.min(1200, text.length * 18);
    later(() => {
      setThinking(false);
      setMessages((m) => [...m, { id: nextId.current++, from: 'joyy', text: simulatedReply(text) }]);
      setBusy(false);
    }, 100 + thinkFor);
    return true;
  };

  return { messages, thinking, busy, send, endRef };
}

/**
 * P2 - AI Coach Guiding (first-time flow, `guiding`) and P2.2 - AI Coach (everyday, with tab bar).
 * Same conversation; the guided version shows the journey steps and leads into P3.
 */
export function Coach({ guiding = false }: { guiding?: boolean }) {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  const [draft, setDraft] = useState('');
  const sendRipple = useRipple();
  const chat = useSimulatedChat();

  const dock = (
    <form
      className="chat-input"
      onSubmit={(e) => {
        e.preventDefault();
        if (chat.send(draft)) setDraft('');
      }}
    >
      <button type="button" className="icon-btn" aria-label="Voice input">
        <Icon name="mic" size={22} color="var(--on-surface-variant)" />
      </button>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share anything..." aria-label="Message Joyy" />
      <button type="submit" className="send-btn ripple-host" aria-label="Send message" disabled={!draft.trim() || chat.busy} {...sendRipple.handlers}>
        {sendRipple.layer}
        <Icon name="send" size={20} color="var(--primary-on)" />
      </button>
    </form>
  );

  return (
    <Screen tab={guiding ? undefined : 'coach'} journey={guiding ? 1 : undefined} dock={dock} label={guiding ? 'AI Coach – guided conversation' : 'AI Coach'}>
      <h1 className="t-h1">Unpacking Next Chapter</h1>

      <StrengthsSoFar defaultOpen={guiding} />

      <div className="feed">
        <JoyyTurn>
          Sarah, after two decades leading technical delivery, you’re very good at bringing order to chaos. When you picture your ideal week now, what
          feeling do you most want to protect?
        </JoyyTurn>
        <SarahTurn>
          I definitely don’t want high-stress deadlines or 50-hour sprints anymore. I genuinely love 1-on-1 mentorship, and I’ve practiced yoga for 8
          years. I want space to breathe.
        </SarahTurn>
        <JoyyTurn>
          Eight years of practice is a real foundation. And wanting meaningful 1-on-1 connection without the operational pressure is an important
          boundary. If we start with about 8 hours a week, would that feel restorative rather than draining?
        </JoyyTurn>

        <button type="button" className="unstyled adapt-note" onClick={() => openOverlay('joyyProfile')}>
          <span className="row gap-8">
            <JoyyAvatar size={20} />
            <strong>Joyy is adapting to you</strong>
          </span>
          <span className="wrap gap-6">
            <span className="adapt-chip">+ Yoga practice</span>
            <span className="adapt-chip">+ Wellness interests</span>
          </span>
          <span className="t-tiny muted">Added to your personalization profile. Tap Joyy’s avatar to review.</span>
        </button>

        <SarahTurn>Yes, exactly. 8 hours feels sustainable. It leaves room for my own yoga practice and family dinners.</SarahTurn>

        <section className="summary-card">
          <div className="row gap-12 align-start">
            <span className="summary-star">
              <Icon name="star" size={16} color="var(--tertiary-on-container)" />
            </span>
            <div className="stack-6 grow">
              <span className="t-overline terracotta">SUMMARY READY</span>
              <h2 className="t-h3">Your strengths snapshot is ready</h2>
              <p className="t-body muted">
                I’ve mapped your 20 years of leadership, your 8-hour weekly limit and your love of mentoring and yoga. Let’s look at what you’ve already
                built.
              </p>
            </div>
          </div>
          <div className="stack-10">
            <Button variant="terracotta" trailing="arrow-right" onClick={() => nav(guiding ? R.strengths : R.me)}>
              {guiding ? 'See My Strengths' : 'View My Strengths'}
            </Button>
            <Button variant="light" icon="chat-lines">
              Keep Talking
            </Button>
          </div>
        </section>

        <div className="live-feed" aria-live="polite">
          {chat.messages.map((m) =>
            m.from === 'sarah' ? (
              <SarahTurn key={m.id}>{m.text}</SarahTurn>
            ) : (
              <JoyyTurn key={m.id}>
                <span className="bubble-in">{m.text}</span>
              </JoyyTurn>
            ),
          )}
          {chat.thinking && <ThinkingTurn />}
        </div>
        <div ref={chat.endRef} className="feed-end" aria-hidden />
      </div>
    </Screen>
  );
}
