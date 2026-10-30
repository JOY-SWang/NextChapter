import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { JourneySteps } from '../components/JourneySteps';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { RadarChart } from '../components/RadarChart';
import { Button, Overline, Pill } from '../components/ui';
import { FIT_AXES } from '../data/content';
import { useApp } from '../context/AppContext';
import { R } from '../routes';

const SELECTED = [
  { emoji: '🌿', title: 'Yoga Instructor', fit: '86% fit' },
  { emoji: '🧭', title: 'Career Mentor', fit: '94% fit' },
  { emoji: '👥', title: 'Workshop Facilitator', fit: '89% fit' },
];

/** P5 - How Each Path Fits You (after choosing a job). */
export function Fit() {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  const [sel, setSel] = useState(0);
  return (
    <Screen label="How each path fits you">
      <JourneySteps current={3} />
      <header className="page-head">
        <h1 className="t-h1">How Each Path Fits You</h1>
        <p className="t-body-lg muted">Your strengths compared with what each path needs.</p>
      </header>

      <div className="stack-8">
        <Overline>YOUR 3 PATHS</Overline>
        <div className="path-tabs" role="tablist">
          {SELECTED.map((s, i) => (
            <button key={s.title} type="button" role="tab" aria-selected={i === sel} className={`path-tab ${i === sel ? 'is-on' : ''}`} onClick={() => setSel(i)}>
              <span className="path-emoji" aria-hidden>
                {s.emoji}
              </span>
              <span className="stack-0">
                <strong>{s.title}</strong>
                <small>{s.fit}</small>
              </span>
            </button>
          ))}
        </div>
      </div>

      <section className="card card-card stack-8">
        <div className="row-between align-start">
          <div className="stack-4">
            <span className="t-overline terracotta">STRENGTHS VS. ROLE NEEDS</span>
            <h2 className="t-h3">Yoga Instructor</h2>
          </div>
          <div className="stack-0 align-end">
            <span className="t-h2 terracotta">86%</span>
            <span className="t-label muted">overall fit</span>
          </div>
        </div>
        <div className="legend-box">
          <div className="row gap-8">
            <span className="legend-swatch swatch-green" />
            <span className="stack-0">
              <strong className="t-label strong-green">Your strengths</strong>
              <span className="t-tiny muted">From your AI Coach conversation</span>
            </span>
          </div>
          <div className="row gap-8">
            <span className="legend-swatch swatch-terracotta" />
            <span className="stack-0">
              <strong className="t-label terracotta">What the role needs</strong>
              <span className="t-tiny muted">Typical studio expectations</span>
            </span>
          </div>
        </div>
        <div className="center-x">
          <RadarChart axes={FIT_AXES} radius={92} mode="compare" ariaLabel="Your strengths compared with yoga instructor role needs; biggest gap is body knowledge and anatomy." />
        </div>
      </section>

      <div className="stack-12">
        <section className="card card-mid stack-8">
          <div className="row gap-8">
            <Icon name="check-circle" size={20} color="var(--primary-key)" />
            <h3 className="t-label-lg strong-green">Where you’re already strong</h3>
          </div>
          <p className="t-body-lg">
            Twenty years of leading meetings and workshops gives you the calm group presence many new instructors take years to build. Your mentoring and
            planning already meet what studios look for.
          </p>
          <div className="row gap-8 t-label strong-green" style={{ paddingTop: 8 }}>
            <Icon name="chart" size={16} /> Immediate asset for retreat design &amp; student retention
          </div>
        </section>

        <section className="card card-card stack-8">
          <div className="row-between">
            <div className="row gap-8">
              <Icon name="milestone" size={20} color="var(--tertiary-key)" />
              <h3 className="t-label-lg terracotta">The gap to close</h3>
            </div>
            <Pill tone="terracotta">Biggest gap</Pill>
          </div>
          <p className="t-body-lg">
            Anatomy knowledge and confident cueing. Most studios ask for a 200-hour certification (RYT-200), usually done part-time over 3–6 months.
          </p>
          <div className="milestone-box">
            <div className="row-between">
              <span className="t-overline muted">FIRST MILESTONE</span>
              <span className="t-label terracotta">Days 1–14</span>
            </div>
            <div className="row gap-8 align-start">
              <Icon name="flag" size={18} color="var(--tertiary-key)" />
              <strong className="t-body strong-green">Try 2 classes &amp; talk to 2 working instructors</strong>
            </div>
          </div>
        </section>

        <section className="card card-low row gap-12">
          <Photo name="elena" alt="Elena Rostova" round style={{ width: 44, height: 44 }} />
          <div className="stack-2">
            <strong className="t-label strong-green">Elena Rostova · Pivoted at 51</strong>
            <span className="t-body muted">“My years of running workshops made teaching a class feel natural.”</span>
          </div>
        </section>
      </div>

      <div className="stack-10">
        <Button variant="primary" onClick={() => openOverlay('planReady')}>
          Build My 100-Day Yoga Plan →
        </Button>
        <Button variant="soft" icon="chat-lines" onClick={() => nav(R.coachGuide)}>
          Discuss this gap with AI Coach
        </Button>
      </div>
    </Screen>
  );
}
