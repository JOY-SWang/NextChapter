import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { CommunityTabs } from './Community';
import { Icon } from '../components/Icon';
import { JoyyAvatar } from '../components/Joyy';
import { Button, Overline, Pill, ProgressBar } from '../components/ui';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

type Source = 'Personal' | 'From Roadmap' | 'From Community' | 'From Discover';
interface Ev {
  time: string;
  icon: string;
  tone: string;
  title: string;
  meta: string;
  source: Source;
  supports?: string;
  to?: string;
}

const DAYS = [
  { d: 'Mon', n: 2 },
  { d: 'Tue', n: 3 },
  { d: 'Wed', n: 4 },
  { d: 'Thu', n: 5 },
  { d: 'Fri', n: 6 },
];

/* Thursday is from Figma; the other days are filled in to make the week strip interactive. */
const SCHEDULE: Record<string, Ev[]> = {
  Mon: [],
  Tue: [{ time: '9:00 AM', icon: 'lotus', tone: 'var(--primary-key)', title: 'Morning Yoga Practice', meta: 'Personal wellness · 45 min', source: 'Personal' }],
  Wed: [],
  Thu: [
    { time: '9:00 AM', icon: 'lotus', tone: 'var(--primary-key)', title: 'Morning Yoga Practice', meta: 'Personal wellness · 45 min', source: 'Personal' },
    {
      time: '2:00 PM',
      icon: 'book',
      tone: 'var(--secondary-text)',
      title: 'Yoga Teaching Research',
      meta: 'Compare 3 RYT-200 training courses · 1 hr',
      source: 'From Roadmap',
      supports: 'Supports Stage 1 milestone',
      to: R.discover,
    },
    {
      time: '7:00 PM',
      icon: 'people',
      tone: 'var(--tertiary-key)',
      title: 'Peer Circle Gathering',
      meta: 'Online group chat · 5 peers going',
      source: 'From Community',
      supports: 'Supports Stage 1 milestone',
      to: R.community,
    },
  ],
  Fri: [
    {
      time: '10:00 AM',
      icon: 'video',
      tone: 'var(--primary-key)',
      title: 'Chat with Elena Rostova',
      meta: 'Video call · 30 min · Free',
      source: 'From Community',
      supports: 'Completes Roadmap Next Action',
      to: R.roadmap,
    },
  ],
};

const SOURCE_TONE: Record<Source, string> = {
  Personal: 'neutral',
  'From Roadmap': 'neutral-green',
  'From Community': 'terracotta',
  'From Discover': 'amber',
};

/** P7.2 - My Day: time planning for things booked in Community, Discover and Roadmap. */
export function MyDay() {
  const nav = useNavigate();
  const { addedToMyDay } = useApp();
  const [day, setDay] = useState('Thu');
  const events = SCHEDULE[day];
  const justAdded = addedToMyDay.length > 0;
  return (
    <Screen tab="community" label="My Day">
      <h1 className="t-h1">Support &amp; Connections</h1>
      <CommunityTabs active="day" />

      {justAdded && (
        <div className="toast" role="status">
          <Icon name="check-circle" size={18} /> Added to My Day — it now shows in your schedule.
        </div>
      )}

      <section className="card card-card stack-8">
        <div className="row gap-8">
          <Icon name="sprout" size={18} stroke={2} color="var(--primary-key)" />
          <strong className="t-label-lg">Your Yoga Teaching Journey</strong>
        </div>
        <div className="row-between">
          <span className="t-caption muted">Day 12 of 100 · Explore &amp; Validate</span>
          <Pill tone="green">Active</Pill>
        </div>
        <ProgressBar value={0.12} />
      </section>

      <div className="row-between">
        <h2 className="t-h2">Today’s Focus</h2>
        <Pill tone="neutral">From Roadmap</Pill>
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

      <div className="row-between">
        <h2 className="t-h2">My Schedule</h2>
        <button type="button" className="add-pill">
          <Icon name="plus" size={14} stroke={2} /> Add
        </button>
      </div>
      <div className="week" role="tablist" aria-label="Week of 2–6 November">
        {DAYS.map((x) => {
          const on = x.d === day;
          const has = SCHEDULE[x.d].length > 0;
          return (
            <button key={x.d} type="button" role="tab" aria-selected={on} className={`day ${on ? 'is-on' : ''}`} onClick={() => setDay(x.d)}>
              <span className="day-name">{x.d}</span>
              <span className="day-num">{x.n}</span>
              <span className={`day-dot ${has ? 'has' : ''}`} />
            </button>
          );
        })}
      </div>
      <div className="timeline">
        {events.length === 0 && <p className="empty-day t-body muted">Nothing planned — a good day to rest.</p>}
        {events.map((e) => (
          <div key={e.title} className="event">
            <span className="event-time">{e.time}</span>
            <button type="button" className="unstyled card card-card event-card" onClick={() => e.to && nav(e.to)}>
              <span className="row gap-8">
                <Icon name={e.icon} size={18} color={e.tone} />
                <strong className="t-label-lg">{e.title}</strong>
              </span>
              <span className="t-caption muted">{e.meta}</span>
              <span className="wrap gap-6">
                <span className={`tag tag-${SOURCE_TONE[e.source]}`}>{e.source}</span>
                {e.supports && (
                  <span className="tag tag-green">
                    <Icon name="milestone" size={12} stroke={2} /> {e.supports}
                  </span>
                )}
              </span>
            </button>
          </div>
        ))}
      </div>

      <section className="card card-low stack-10">
        <div className="row-between">
          <strong className="t-label-lg">My Weekly Time</strong>
          <span className="t-label-lg strong-green">5 / 8 hrs</span>
        </div>
        <ProgressBar value={5 / 8} height={8} track="var(--surface-container-high)" />
        <p className="t-caption muted">About 3 hours left in your 8-hour weekly limit. Joyy won’t suggest more than that.</p>
      </section>

      <section className="card card-card stack-10">
        <div className="row gap-10">
          <JoyyAvatar size={32} />
          <h2 className="t-h4">Check in with Joyy</h2>
        </div>
        <p className="t-body muted">How did today go? Share a quick note and Joyy can suggest adjustments to your plan.</p>
        <Button variant="outline" pill trailing="arrow-right" onClick={() => nav(R.coach)}>
          Reflect with Joyy
        </Button>
      </section>
    </Screen>
  );
}
