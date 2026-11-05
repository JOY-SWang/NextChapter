import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

type Source = 'Personal' | 'From My Plan' | 'From Community' | 'From Explore';
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
      source: 'From My Plan',
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
  'From My Plan': 'neutral-green',
  'From Community': 'terracotta',
  'From Explore': 'amber',
};

/**
 * "My Schedule" — heading with + Add, Mon–Fri week strip and the selected day's timeline.
 * Shared by Home (P0) and the hidden My Day screen (P7.2). Event cards that come from
 * another part of the app link back to it (My Plan → Discover, Community → Community).
 */
export function WeekSchedule() {
  const nav = useNavigate();
  const { addedToMyDay } = useApp();
  const [day, setDay] = useState('Thu');
  const events = SCHEDULE[day];
  return (
    <>
      <div className="row-between">
        <h2 className="t-h2">My Schedule</h2>
        <button type="button" className="add-pill">
          <Icon name="plus" size={14} stroke={2} /> Add
        </button>
      </div>

      {addedToMyDay.length > 0 && (
        <div className="toast" role="status">
          <Icon name="check-circle" size={18} /> Added to My Day — it now shows in your schedule.
        </div>
      )}

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
    </>
  );
}
