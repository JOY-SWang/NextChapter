import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { CommunityTabs } from './Community';
import { Icon } from '../components/Icon';
import { JoyAIAvatar } from '../components/JoyAI';
import { WeekSchedule } from '../components/WeekSchedule';
import { JourneyProgress } from '../components/JourneyProgress';
import { Button, Overline, Pill, ProgressBar } from '../components/ui';
import { R } from '../routes';

/** P7.2 - My Day: time planning for things booked in Community, Explore and My Plan. */
export function MyDay() {
  const nav = useNavigate();
  return (
    <Screen tab="community" label="My Day">
      <h1 className="t-h1">Support &amp; Connections</h1>
      <CommunityTabs active="day" />

      <JourneyProgress />

      <div className="row-between">
        <h2 className="t-h2">Today’s Focus</h2>
        <Pill tone="neutral">From My Plan</Pill>
      </div>
      <section className="card card-dark stack-10 focus-card">
        <Overline icon="flag" color="var(--primary-container)">
          YOUR NEXT SMALL STEP
        </Overline>
        <h3 className="t-h2 on-dark">Prepare 3 questions for your chat with Elena</h3>
        <p className="t-body on-dark-soft">Think about training, teaching opportunities and how to start at a comfortable pace. Your chat is on Friday.</p>
        <span className="row gap-8 t-caption" style={{ color: 'var(--primary-container)' }}>
          <Icon name="clock" size={16} /> 15–20 minutes · Flexible timing
        </span>
        <Button variant="glass" pill trailing="arrow-right" onClick={() => nav(R.roadmap)}>
          Open Today’s Focus
        </Button>
      </section>

      <WeekSchedule />

      <section className="card card-low stack-10">
        <div className="row-between">
          <strong className="t-label-lg">My Weekly Time</strong>
          <span className="t-label-lg strong-green">5 / 8 hrs</span>
        </div>
        <ProgressBar value={5 / 8} height={8} track="var(--surface-container-high)" />
        <p className="t-caption muted">About 3 hours left in your 8-hour weekly limit. JoyAI won’t suggest more than that.</p>
      </section>

      <section className="card card-card stack-10">
        <div className="row gap-10">
          <JoyAIAvatar size={32} />
          <h2 className="t-h4">Check in with JoyAI</h2>
        </div>
        <p className="t-body muted">How did today go? Share a quick note and JoyAI can suggest adjustments to your plan.</p>
        <Button variant="outline" pill trailing="arrow-right" onClick={() => nav(R.coach)}>
          Reflect with JoyAI
        </Button>
      </section>
    </Screen>
  );
}
