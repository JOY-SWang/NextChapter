import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Button, Overline, Pill, ProgressRing } from '../components/ui';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

const TASKS = [
  { title: 'Talk to 2 working yoga instructors', note: 'Understand realistic day-to-day energy, studio payouts, and self-care rhythms.', progress: '1 of 2', done: false },
  { title: 'Attend 2 diverse trial studio classes', note: "Visited 'Prana Flow Vinyasa' & 'Soma Yin'. Observed teacher cueing nuances.", done: true },
  { title: 'Review Yoga Alliance RYT-200 prerequisites', note: 'Confirmed anatomy & philosophy module hours criteria.', done: true },
];

const STAGES = [
  { n: 2, days: 'Stage 2 · Days 15–40', status: 'Upcoming', title: 'Build Your Foundation', note: 'Compare training providers, costs and schedules', icon: null },
  { n: 3, days: 'Stage 3 · Days 41–75', status: 'Locked', title: 'Learn & Practise', note: 'Begin training and practise leading short sessions', icon: 'lock' },
  { n: 4, days: 'Stage 4 · Days 76–100', status: 'Future', title: 'Test Your Next Step', note: 'Get feedback, try assistant teaching and reassess', icon: 'flag' },
];

/** P6 - My Plan tab — "My 100-Day Roadmap": long-term goal → milestones → next action. */
export function Roadmap() {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  const [open, setOpen] = useState(true);
  return (
    <Screen tab="roadmap" label="My Plan – My 100-Day Roadmap">
      <header className="page-head">
        <button type="button" className="unstyled edit-link" onClick={() => nav(R.coach)}>
          <Icon name="tune" size={15} /> Edit plan
        </button>
        <h1 className="t-h1">My 100-Day Roadmap</h1>
        <p className="t-body muted">Exploring yoga teaching · Day 12 of 100</p>
      </header>

      <section className="card card-low stack-16">
        <div className="row gap-12 align-start">
          <div className="grow stack-4">
            <Overline icon="stage" color="var(--on-surface-variant)">
              CURRENT STAGE
            </Overline>
            <h2 className="t-h2">Stage 1: Explore &amp; Validate</h2>
            <span className="row gap-6 t-body muted">
              <Icon name="clock" size={15} /> 8 hrs/week paced · Days 1–14
            </span>
          </div>
          <div className="ring-wrap">
            <ProgressRing value={0.12} />
            <span className="ring-value">12%</span>
            <span className="t-tiny muted">Progress</span>
          </div>
        </div>
        <div className="goal-box">
          <Icon name="flag" size={20} color="var(--tertiary-key)" />
          <div className="stack-2">
            <span className="t-overline terracotta">LONG-TERM GOAL</span>
            <strong className="t-label-lg strong-green">Teach yoga part-time and mentor others in wellness</strong>
          </div>
        </div>
      </section>

      <section className="card card-dark stack-12">
        <div className="row-between">
          <Pill tone="terracotta-solid" icon="sparkle">
            NEXT ACTION
          </Pill>
          <span className="t-label on-dark-muted">This week</span>
        </div>
        <h2 className="t-h2 on-dark">Book a free 30-min chat with yoga teacher Elena</h2>
        <div className="mentor-row">
          <Photo name="elena" alt="Elena Rostova" round style={{ width: 48, height: 48 }} />
          <div className="stack-2">
            <span className="row gap-6 t-label-lg on-dark">
              Elena Rostova, E-RYT 500 <Icon name="verified" size={16} color="var(--secondary-key)" />
            </span>
            <span className="t-caption on-dark-muted">Former tech program manager · teaching since 51</span>
          </div>
        </div>
        <span className="row gap-8 t-body on-dark-muted">
          <Icon name="check-circle" size={16} /> Included in your membership · 30-min casual chat
        </span>
        <div className="stack-10">
          <Button variant="terracotta" icon="calendar" onClick={() => openOverlay('chatBooked')}>
            Schedule 30-min Chat
          </Button>
          <Button variant="onDark" icon="check-circle">
            Mark as Done
          </Button>
        </div>
      </section>

      <section className="stack-16">
        <div className="row-between">
          <h2 className="t-h3">Milestones</h2>
          <Pill tone="neutral">4 Stages</Pill>
        </div>

        <div className="card card-card stage-card is-active">
          <button type="button" className="unstyled stage-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            <span className="stage-dot stage-dot-active">
              <Icon name="stage" size={18} />
            </span>
            <span className="grow stack-2">
              <span className="row-between">
                <span className="t-label terracotta strongest">Stage 1 · Days 1–14</span>
                <Pill tone="terracotta">Active · 2/3</Pill>
              </span>
              <span className="t-h3">Explore &amp; Validate</span>
              <span className="t-body muted">Learn what the work is really like before paying for training</span>
            </span>
            <Icon name="chevron-down" size={18} color="var(--outline)" style={{ transform: open ? 'rotate(180deg)' : undefined }} />
          </button>
          {open && (
            <ul className="tasks">
              {TASKS.map((t) => (
                <li key={t.title} className={`task ${t.done ? 'is-done' : ''}`}>
                  <span className={`checkbox ${t.done ? 'is-on' : ''}`}>{t.done && <Icon name="check" size={14} stroke={2.6} color="#fff" />}</span>
                  <span className="stack-2 grow">
                    <span className="row gap-6 align-start">
                      <span className="task-title">{t.title}</span>
                      {t.progress && <span className="t-tiny terracotta strongest">{t.progress}</span>}
                    </span>
                    <span className="t-body muted">{t.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {STAGES.map((s) => (
          <button key={s.n} type="button" className="unstyled card card-card stage-card" onClick={() => s.n === 2 && nav(R.discover)}>
            <span className="stage-head">
              <span className="stage-dot">{s.icon ? <Icon name={s.icon} size={16} /> : s.n}</span>
              <span className="grow stack-2">
                <span className="row-between">
                  <span className="t-label muted">{s.days}</span>
                  <Pill tone="neutral">{s.status}</Pill>
                </span>
                <span className="t-h3">{s.title}</span>
                <span className="t-body muted">{s.note}</span>
              </span>
              <Icon name="chevron-down" size={18} color="var(--outline)" />
            </span>
          </button>
        ))}
      </section>

      <section className="card card-low row gap-16 align-start">
        <Photo name="yoga-space" alt="A calm yoga studio" style={{ width: 80, height: 80, borderRadius: 8 }} />
        <div className="stack-4">
          <p className="t-serif-md">"Action dissolves hesitation."</p>
          <p className="t-body muted">Pacing is completely within your control. You are gathering curiosity, not signing binding contracts.</p>
        </div>
      </section>

      <div className="stack-10" style={{ paddingTop: 16 }}>
        <Button variant="primary" icon="calendar" className="btn-r14">
          Export to Calendar
        </Button>
        <Button variant="soft" icon="refresh" onClick={() => nav(R.coach)} className="btn-r14">
          Re-balance Pace
        </Button>
      </div>
    </Screen>
  );
}
