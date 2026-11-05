import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { JoyAI, JoyAIAvatar } from '../components/JoyAI';
import { Reveal } from '../components/Motion';
import { RadarChart } from '../components/RadarChart';
import { JourneyProgress } from '../components/JourneyProgress';
import { WeekSchedule } from '../components/WeekSchedule';
import { Button } from '../components/ui';
import { FIT_AXES } from '../data/content';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

/**
 * JoyAI's proactive check-in — the first card on Home so JoyAI is hard to miss.
 * JoyAI opens the conversation based on Sarah's progress; "Let's talk" goes to the AI Coach,
 * "Not now" folds it into a quiet one-line reminder (low-pressure, reversible).
 */
function JoyAICheckin() {
  const nav = useNavigate();
  const { openOverlay, joyaiCheckinDismissed, setJoyAICheckinDismissed } = useApp();

  if (joyaiCheckinDismissed) {
    return (
      <div className="joyai-checkin-mini">
        <JoyAIAvatar size={32} onClick={() => openOverlay('joyaiProfile')} />
        <span className="t-caption muted grow">JoyAI’s here whenever you want to talk.</span>
        <button type="button" className="unstyled text-link no-underline t-label strong-green" onClick={() => setJoyAICheckinDismissed(false)}>
          Show message
        </button>
      </div>
    );
  }

  return (
    <section className="joyai-checkin" aria-label="Message from JoyAI">
      <div className="row gap-10">
        <button type="button" className="unstyled joyai-checkin-avatar" aria-label="Open JoyAI’s profile" onClick={() => openOverlay('joyaiProfile')}>
          <JoyAI mood="wink" size={52} />
        </button>
        <div className="stack-0">
          <strong className="t-h4">JoyAI</strong>
          <span className="t-caption muted">Checking in on your progress</span>
        </div>
      </div>
      <p className="joyai-bubble">Sarah, you explored yoga teaching yesterday! How are you feeling about it today?</p>
      <Button pill trailing="arrow-right" onClick={() => nav(R.coach)}>
        Let’s talk
      </Button>
      <button type="button" className="unstyled joyai-checkin-later" onClick={() => setJoyAICheckinDismissed(true)}>
        Not now
      </button>
    </section>
  );
}

/** P0 - Home: greeting, JoyAI check-in, journey + fit radar, and this week's schedule. */
export function Home() {
  const nav = useNavigate();
  return (
    <Screen tab="home" label="Home">
      <Reveal as="header" className="page-head">
        <h1 className="t-h1">Hi! Sarah!</h1>
        <p className="t-body-lg muted">You’re making progress, Sarah. Let’s keep going!</p>
      </Reveal>

      <Reveal delay={60}>
        <JoyAICheckin />
      </Reveal>

      <Reveal className="stack-8" delay={120}>
        <JourneyProgress onClick={() => nav(R.roadmap)} />
        <button
          type="button"
          className="unstyled card card-card home-radar"
          onClick={() => nav(R.fit)}
          aria-label="Your strengths compared with what yoga teaching needs — open the full comparison"
        >
          <span className="row-between home-radar-head">
            <span className="row gap-6 t-caption">
              <span className="legend-swatch swatch-green" /> You
              <span className="legend-swatch swatch-terracotta" style={{ marginLeft: 8 }} /> Yoga Instructor needs
            </span>
            <Icon name="chevron-right" size={18} color="var(--outline)" />
          </span>
          <span className="center-x">
            <RadarChart axes={FIT_AXES} radius={88} mode="compare" animate ariaLabel="Your strengths compared with yoga instructor role needs; biggest gap is body knowledge and anatomy." />
          </span>
        </button>
      </Reveal>

      <WeekSchedule />
    </Screen>
  );
}
