import { useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { CountUp, Reveal } from '../components/Motion';
import { RadarChart } from '../components/RadarChart';
import { Button, IconTile, Pill } from '../components/ui';
import { STRENGTH_EVIDENCE, STRENGTH_META, STRENGTH_ORDER, strengthLevel, toAxes, type StrengthKey } from '../data/content';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

/** P3 - User Strength ("Your Strengths Snapshot"). */
export function Strengths() {
  const nav = useNavigate();
  const { strengths } = useApp();
  // Top three strengths — follows Sarah's own edits from the User page.
  const pillars = [...STRENGTH_ORDER]
    .sort((a, b) => strengths[b] - strengths[a])
    .slice(0, 3)
    .map((k) => ({ key: k, ...STRENGTH_META[k], ...STRENGTH_EVIDENCE[k], pct: strengths[k] }));
  // One strength open at a time, so the list stays easy to scan.
  const [open, setOpen] = useState<StrengthKey | null>(null);
  const uid = useId();
  return (
    <Screen journey={2} label="Your strengths snapshot">
      <Reveal as="header" className="page-head">
        <h1 className="t-h1">Your Strengths Snapshot</h1>
        <p className="t-body-lg muted">Drawn from your conversation with AI Coach. Your 20 years haven’t vanished — here is what you’ve built.</p>
      </Reveal>

      <Reveal as="section" className="card card-card" delay={80}>
        <div className="row-between align-start">
          <div className="stack-2">
            <span className="t-overline terracotta">TRANSFERABLE STRENGTHS</span>
            <h2 className="t-h3">Your strengths map</h2>
          </div>
          <Pill tone="dark" icon="verified">
            High Leverage
          </Pill>
        </div>
        <div className="center-x">
          <RadarChart
            axes={toAxes(STRENGTH_ORDER, strengths)}
            radius={96}
            mode="mastery"
            animate
            ariaLabel={`Strengths map: ${STRENGTH_ORDER.map((k) => `${STRENGTH_META[k].label} ${strengths[k]}%`).join(', ')}`}
          />
        </div>
        <div className="legend">
          <span>
            <i style={{ background: 'var(--secondary-key)' }} /> High mastery zone (&gt;85%)
          </span>
          <span>
            <i style={{ background: 'var(--tertiary-key)' }} /> Emergent capacity
          </span>
        </div>
      </Reveal>

      <Reveal as="section" className="card card-low row gap-12 align-start">
        <IconTile icon="star" tone="dark" size={40} radius={20} iconSize={16} />
        <div className="stack-4">
          <h2 className="t-h3">
            Sarah, you’ve mentored <CountUp to={35} suffix="+" /> people over 20 years.
          </h2>
          <p className="t-body muted">These aren’t corporate-only skills. They carry straight into teaching, coaching and community work.</p>
        </div>
      </Reveal>

      <section className="stack-12">
        <Reveal as="h2" className="t-h3">
          Your top strengths
        </Reveal>
        {pillars.map((p, i) => {
          const isOpen = open === p.key;
          const panelId = `${uid}-${p.key}`;
          return (
            <Reveal as="section" variant="left" delay={i * 110} key={p.key} className={`card card-card pillar-card ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="unstyled pillar"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : p.key)}
              >
                <IconTile icon={p.icon} tone="neutral" size={40} radius={12} iconSize={20} />
                <span className="grow stack-2">
                  <span className="row gap-8 align-start">
                    <span className="t-label-lg grow">{p.title}</span>
                    <span className="pct-badge">
                      <CountUp to={p.pct} suffix="%" delay={250 + i * 110} />
                    </span>
                  </span>
                  <span className="t-body muted">{p.sub}</span>
                </span>
                <Icon name="chevron-down" size={20} color="var(--outline)" className="pillar-chevron" />
              </button>
              <div id={panelId} className="pillar-panel" role="region" aria-label={`${p.title} details`} aria-hidden={!isOpen} {...(isOpen ? {} : { inert: '' })}>
                <div className="pillar-panel-inner">
                  <div className="pillar-detail stack-12">
                    <div className="stack-6">
                      <div className="row-between t-label">
                        <span className="muted">Level</span>
                        <span className="strong-green">{strengthLevel(p.pct)}</span>
                      </div>
                      <div className="rating-track">
                        <span style={{ width: isOpen ? `${p.pct}%` : 0, background: 'var(--primary-key)' }} />
                      </div>
                    </div>
                    <div className="evidence">
                      <span className="t-label muted">What JoyAI heard</span>
                      <p className="t-body-italic">{p.evidence}</p>
                    </div>
                    <div className="stack-6">
                      <span className="t-label muted">Shows up as</span>
                      <div className="wrap gap-6">
                        {p.tags.map((t) => (
                          <Pill key={t} tone="neutral">
                            {t}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </section>

      <Reveal as="section" variant="fade" className="card card-high quote-card">
        <p className="t-quote">“You don’t need to reinvent yourself from scratch. You only need to redirect your craftsmanship.”</p>
        <Icon name="quote" size={56} stroke={3} color="rgba(30,56,43,.12)" className="quote-mark" />
      </Reveal>

      <Reveal className="stack-6">
        <Button variant="primary" trailing="arrow-right" onClick={() => nav(R.possibilities)}>
          See Where They Could Take Me
        </Button>
        <Button variant="ghost" icon="tune" onClick={() => nav(R.me)}>
          Edit My Strengths
        </Button>
      </Reveal>
    </Screen>
  );
}
