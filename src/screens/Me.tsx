import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { RadarChart } from '../components/RadarChart';
import { Button, Overline, Pill } from '../components/ui';
import { BALANCE_AXES } from '../data/content';
import { R } from '../routes';

const PILLARS = [
  {
    title: 'Leadership & Mentoring',
    sub: 'Your strongest area',
    pct: 92,
    rating: 'Very strong',
    evidence: '“Mentored 35+ tech managers through organizational volatility; certified internal coaching facilitator for mid-tier transitions.”',
    tags: ['1-on-1 Dialogue', 'Empathetic Listening', 'Psychological Safety'],
    addTag: true,
  },
  {
    title: 'Project Planning & Execution',
    sub: '20 years of delivery',
    pct: 95,
    rating: 'Very strong',
    evidence: '“20 years orchestrating multi-million budgets, complex program rollouts, and calming stakeholder anxiety during critical go-lives.”',
    tags: ['Budget Stewardship', 'Milestone Roadmapping', 'Boundary Setting'],
  },
  {
    title: 'Communication & Facilitation',
    sub: 'Clear, calm explainer',
    pct: 88,
    rating: 'Strong',
    evidence: '“Experienced keynote presenter, interactive workshop host for cross-functional leaders, and creator of quiet consensus.”',
    tags: ['Story Crafting', 'Conflict De-escalation'],
  },
  {
    title: 'Yoga & Wellness Practice',
    sub: 'Growing interest',
    pct: 72,
    rating: 'Developing',
    evidence: '“8 years of personal yoga practice; now learning anatomy basics and breathwork.”',
    tags: ['Mindful Breath', 'Yoga Asana', 'Anatomy 101'],
    growing: true,
  },
];

/** User Page (Me) — opened from the avatar in the top bar. */
export function Me() {
  const nav = useNavigate();
  const [tab, setTab] = useState(0);
  return (
    <Screen top="profile" tab={null} label="My profile and strengths">
      <section className="card card-card stack-12">
        <div className="row gap-12">
          <Photo name="sarah" alt="Sarah Jenkins" round style={{ width: 64, height: 64 }} />
          <div className="grow stack-4">
            <div className="row-between">
              <span className="t-h3">Sarah Jenkins, 48</span>
              <Pill tone="neutral">Day 12</Pill>
            </div>
            <span className="t-body muted">20 years in tech · project &amp; team lead</span>
            <Pill tone="terracotta" style={{ alignSelf: 'flex-start' }}>
              Exploring: yoga teaching
            </Pill>
          </div>
        </div>
        <div className="mini-tabs" role="tablist">
          {['My Strengths', 'Saved Paths (3)', 'Notes'].map((t, i) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={i === tab}
              className={i === tab ? 'is-on' : ''}
              onClick={() => (i === 1 ? nav(R.fit) : setTab(i))}
            >
              {i === 0 && <Icon name="sparkle" size={12} />} {t}
            </button>
          ))}
        </div>
      </section>

      <section className="card card-low stack-6">
        <div className="row-between align-start">
          <div className="stack-4">
            <Overline color="var(--tertiary-key)">MY STRENGTHS</Overline>
            <h1 className="t-h1">My Strengths Profile</h1>
          </div>
          <span className="icon-tile tile-neutral" style={{ width: 36, height: 36, borderRadius: 10 }}>
            <Icon name="export" size={18} />
          </span>
        </div>
        <p className="t-body muted">Your strengths keep growing as you try new things. Edit them any time.</p>
        <span className="row gap-6 t-label muted">
          <Icon name="refresh" size={14} /> Updated yesterday after your AI Coach chat
        </span>
      </section>

      <section className="card card-card stack-12">
        <div className="row-between">
          <h2 className="t-h3">Strengths balance</h2>
          <button type="button" className="add-pill soft">
            <Icon name="pencil" size={14} /> Edit
          </button>
        </div>
        <div className="center-x">
          <RadarChart axes={BALANCE_AXES} radius={92} ariaLabel="Strengths balance across six areas" />
        </div>
        <div className="pairing">
          <span className="row gap-8 t-body">
            <Icon name="lightbulb" size={18} color="var(--secondary-text)" /> Strongest pairing:
          </span>
          <strong className="t-label strong-green">Mentoring + Planning</strong>
        </div>
      </section>

      <div className="row-between">
        <h2 className="t-h3">Strengths &amp; evidence</h2>
        <span className="t-label muted">Top 4 of 6</span>
      </div>
      <div className="stack-20">
        {PILLARS.map((p) => (
          <section key={p.title} className="card card-card stack-8">
            {p.growing && (
              <Pill tone="terracotta" icon="arrow-right" style={{ alignSelf: 'flex-start' }}>
                +5% after your first trial class
              </Pill>
            )}
            <div className="row gap-12 align-start">
              <div className="grow stack-4">
                <h3 className="t-h3">{p.title}</h3>
                <span className={`t-label ${p.growing ? 'terracotta' : 'muted'}`}>{p.sub}</span>
              </div>
              <span className={`t-h3 ${p.growing ? 'terracotta' : 'strong-green'}`}>{p.pct}%</span>
            </div>
            <div className="stack-6">
              <div className="row-between t-label">
                <span className="muted">Self-rating</span>
                <span className={p.growing ? 'terracotta' : 'strong-green'}>{p.rating}</span>
              </div>
              <div className="rating-track">
                <span style={{ width: `${p.pct}%`, background: p.growing ? 'var(--tertiary-key)' : 'var(--primary-key)' }} />
              </div>
            </div>
            <div className="evidence">
              <span className="t-label muted">Evidence</span>
              <p className="t-body-italic">{p.evidence}</p>
            </div>
            <div className="wrap gap-6">
              {p.tags.map((t) => (
                <Pill key={t} tone={p.growing && t !== 'Anatomy 101' ? 'terracotta' : 'neutral'}>
                  {t}
                </Pill>
              ))}
              {p.addTag && (
                <Pill tone="outline" icon="plus">
                  Tag
                </Pill>
              )}
            </div>
          </section>
        ))}
      </div>

      <button type="button" className="unstyled card card-low add-strength">
        <Icon name="plus" size={18} color="var(--secondary-text)" /> + Add a strength
      </button>

      <section className="card card-card row gap-12 align-start">
        <Photo name="reflection" alt="Journal and tea" style={{ width: 80, height: 80, borderRadius: 8 }} />
        <div className="stack-4">
          <h2 className="t-h3">My reflection</h2>
          <p className="t-body muted">“I used to believe my worth was only in execution speed. This week I saw it’s also in how I help people grow.”</p>
          <span className="t-label terracotta">Journal · Day 10</span>
        </div>
      </section>

      <div className="card card-low stack-8" style={{ padding: 10, borderRadius: 16 }}>
        <Button variant="strong" icon="refresh" onClick={() => nav(R.fit)}>
          Update My Path Matches
        </Button>
        <Button variant="ghost" size="sm" icon="export">
          Export strengths summary (PDF)
        </Button>
      </div>
    </Screen>
  );
}
