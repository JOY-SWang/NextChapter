import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { R } from '../routes';

interface Thread {
  name: string;
  role: string;
  roleTone: string;
  time: string;
  preview: string;
  meta: [string, string];
  unread?: 'dot' | number;
  avatar: { photo?: 'elena'; icon?: string; tone?: string };
  kind: 'Guides' | 'Circles';
  to: string;
}

const THREADS: Thread[] = [
  {
    name: 'Elena Rostova',
    role: 'Human Guide',
    roleTone: 'strong-green',
    time: '10:42 AM',
    preview: 'Hi Sarah! Looking forward to our chat on Friday. Feel free to send your questions before then.',
    meta: ['calendar', 'Fri 6 Nov · 10:00 AM'],
    unread: 'dot',
    avatar: { photo: 'elena' },
    kind: 'Guides',
    to: R.community,
  },
  {
    name: 'Thursday Coffee Chat',
    role: 'Event',
    roleTone: 'muted',
    time: '8:15 AM',
    preview: 'Reminder: we meet online tonight at 7:00 PM. The link is pinned here.',
    meta: ['coffee', 'Today · 7:00 PM · 5 going'],
    avatar: { icon: 'coffee', tone: 'amber' },
    kind: 'Circles',
    to: R.community,
  },
  {
    name: 'Later-Life Tech to Wellness',
    role: 'Peer Circle',
    roleTone: 'terracotta',
    time: 'Yesterday',
    preview: 'Maya: Thanks everyone for sharing your experiences!',
    meta: ['people', '8 members'],
    unread: 2,
    avatar: { icon: 'people', tone: 'terracotta' },
    kind: 'Circles',
    to: R.community,
  },
  {
    name: 'Guide Support',
    role: 'Next Chapter team',
    roleTone: 'muted',
    time: 'Monday',
    preview: 'Your chat with Elena is confirmed. You can reschedule up to 24 hours before.',
    meta: ['calendar', 'Appointment update'],
    avatar: { icon: 'user', tone: 'green' },
    kind: 'Guides',
    to: R.community,
  },
];

/** P8 - Messages (💬 in the top bar). Sample people/messages show the information structure only. */
export function Messages() {
  const nav = useNavigate();
  const [filter, setFilter] = useState<'All' | 'Guides' | 'Circles'>('All');
  const list = THREADS.filter((t) => filter === 'All' || t.kind === filter);
  return (
    <Screen top="messages" tab={null} label="Messages">
      <div className="row gap-10">
        <button type="button" className="icon-btn" aria-label="Back" onClick={() => nav(-1)}>
          <Icon name="arrow-left" size={22} stroke={2} />
        </button>
        <h1 className="t-h1 grow">Messages</h1>
        <button type="button" className="icon-btn icon-btn-soft round" aria-label="More options">
          <Icon name="more" size={20} stroke={2.4} />
        </button>
      </div>
      <p className="t-body-md muted">Stay connected with the people supporting your journey.</p>
      <div className="seg-tabs pill-tabs" role="tablist">
        {(['All', 'Guides', 'Circles'] as const).map((f) => (
          <button key={f} type="button" role="tab" aria-selected={f === filter} className={f === filter ? 'is-on' : ''} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <ul className="threads card card-card">
        {list.map((t) => (
          <li key={t.name}>
            <button type="button" className="unstyled thread" onClick={() => nav(t.to)}>
              {t.avatar.photo ? (
                <Photo name={t.avatar.photo} alt={t.name} round className="thread-avatar" />
              ) : (
                <span className={`thread-avatar icon-tile tile-${t.avatar.tone}`}>
                  <Icon name={t.avatar.icon!} size={24} />
                </span>
              )}
              <span className="grow stack-4">
                <span className="row gap-8">
                  <strong className="t-label-lg grow">{t.name}</strong>
                  <span className={`t-tiny ${t.unread ? 'strong-green strongest' : 'outline'}`}>{t.time}</span>
                </span>
                <span className={`t-label ${t.roleTone}`}>{t.role}</span>
                <span className="row gap-10">
                  <span className={`t-body grow ${t.unread ? 'unread-text' : 'muted'}`}>{t.preview}</span>
                  {t.unread === 'dot' && <span className="unread-big-dot" aria-label="Unread" />}
                  {typeof t.unread === 'number' && <span className="unread-count">{t.unread}</span>}
                </span>
                <span className="row gap-6 t-tiny outline">
                  <Icon name={t.meta[0]} size={15} /> {t.meta[1]}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="t-tiny outline center">Sample people and messages show the information structure only.</p>
    </Screen>
  );
}
