import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { JourneySteps } from '../components/JourneySteps';
import { Icon } from '../components/Icon';
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

/**
 * P2 - AI Coach Guiding (first-time flow, `guiding`) and P2.2 - AI Coach (everyday, with tab bar).
 * Same conversation; the guided version shows the journey steps and leads into P3.
 */
export function Coach({ guiding = false }: { guiding?: boolean }) {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  const [draft, setDraft] = useState('');

  const dock = (
    <form className="chat-input" onSubmit={(e) => (e.preventDefault(), setDraft(''))}>
      <button type="button" className="icon-btn" aria-label="Voice input">
        <Icon name="mic" size={22} color="var(--on-surface-variant)" />
      </button>
      <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Share anything..." aria-label="Message Joyy" />
      <button type="submit" className="send-btn" aria-label="Send message">
        <Icon name="send" size={20} color="var(--primary-on)" />
      </button>
    </form>
  );

  return (
    <Screen tab={guiding ? undefined : 'coach'} dock={dock} label={guiding ? 'AI Coach – guided conversation' : 'AI Coach'}>
      {guiding && <JourneySteps current={1} />}
      <h1 className="t-h1">Unpacking Next Chapter</h1>

      <section className="card card-card strengths-sofar">
        <span className="glow" aria-hidden />
        <div className="row-between">
          <div className="row gap-8">
            <span className="mini-icon mini-dark">
              <Icon name="sparkle" size={12} color="var(--primary-container)" />
            </span>
            <span className="t-h3">Strengths so far</span>
          </div>
          <Pill tone="terracotta">20 yrs in tech</Pill>
        </div>
        <p className="t-quote-md">“What have you already built, and where could it take you next?”</p>
        <div className="wrap gap-8">
          {[
            ['people', 'Leadership & Mentoring'],
            ['chat-lines', 'Communication & Facilitation'],
            ['layers', 'Project Planning'],
            ['refresh', 'Adaptability'],
          ].map(([i, t]) => (
            <Pill key={t} tone="neutral" icon={i}>
              {t}
            </Pill>
          ))}
        </div>
      </section>

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
      </div>
    </Screen>
  );
}
