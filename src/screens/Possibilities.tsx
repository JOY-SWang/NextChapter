import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { JourneySteps } from '../components/JourneySteps';
import { Icon } from '../components/Icon';
import { Photo } from '../components/Photo';
import { Button, FilterChips, Pill } from '../components/ui';
import { PATHS } from '../data/content';
import { R } from '../routes';

/** P4 - Your Next Possibilities (before choosing a job). */
export function Possibilities() {
  const nav = useNavigate();
  const [filter, setFilter] = useState(0);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  return (
    <Screen label="Your next possibilities">
      <JourneySteps current={3} />
      <header className="page-head">
        <h1 className="t-h1">Your Next Possibilities</h1>
        <p className="t-body-lg muted">Based on your 20 years of experience, mentoring passion &amp; available 8 hrs/week.</p>
      </header>
      <FilterChips items={['All Options (3)', 'Wellness & Teaching', 'Advisory', 'Community']} active={filter} onSelect={setFilter} />

      <div className="stack-24">
        {PATHS.map((p) => (
          <article key={p.id} className="card card-card path-card">
            <div className="path-media">
              <Photo name={p.photo} alt={p.title} className="path-photo" style={{ height: p.primary ? 144 : 128 }} />
              <Pill tone="white" icon={p.badge.icon} className="media-badge" style={{ color: p.badge.color }}>
                {p.badge.label}
              </Pill>
            </div>
            <div className="path-body">
              <div className="stack-8">
                <div className="row gap-8 align-start">
                  <h2 className="t-h2 grow">{p.title}</h2>
                  <Pill tone="green">{p.fit}% fit</Pill>
                </div>
                <p className="t-body-lg muted">{p.body}</p>
              </div>
              <div className="why-box">
                <span className="row gap-6 t-label strong-green">
                  <Icon name="sparkle" size={13} color="var(--primary-key)" /> Why this fits you
                </span>
                <span className="t-body muted">{p.why}</span>
              </div>
              {p.facts && (
                <ul className="facts">
                  {p.facts.map((f) => (
                    <li key={f.text} className={f.strong ? 'strong' : ''}>
                      <Icon name={f.icon} size={15} color={f.icon === 'flag' ? 'var(--tertiary-key)' : 'currentColor'} /> {f.text}
                    </li>
                  ))}
                </ul>
              )}
              {p.tags && (
                <div className="wrap gap-6">
                  {p.tags.map((t) => (
                    <Pill key={t.text} tone="neutral" icon={t.icon}>
                      {t.text}
                    </Pill>
                  ))}
                </div>
              )}
              {p.primary ? (
                <div className="row gap-12">
                  <Button variant="strong" trailing="arrow-right" block={false} className="grow" onClick={() => nav(R.fit)}>
                    Explore This Path
                  </Button>
                  <button type="button" className={`vote ${vote === 'up' ? 'is-on' : ''}`} aria-label="Helpful recommendation" onClick={() => setVote('up')}>
                    <Icon name="thumb-up" size={18} />
                  </button>
                  <button type="button" className={`vote ${vote === 'down' ? 'is-on' : ''}`} aria-label="Not a good fit" onClick={() => setVote('down')}>
                    <Icon name="thumb-down" size={18} />
                  </button>
                </div>
              ) : (
                <Button variant="soft" trailing="arrow-right" onClick={() => nav(R.fit)}>
                  Explore This Path
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="card card-low stack-14">
        <div className="row gap-12">
          <span className="icon-tile tile-dark" style={{ width: 40, height: 40, borderRadius: 20 }}>
            <Icon name="help" size={20} />
          </span>
          <h2 className="t-h3">Not quite right?</h2>
        </div>
        <p className="t-body-lg">Tell AI Coach what to change — income, pace or location — and it will suggest new options.</p>
        <div className="stack-10">
          <Button variant="terracotta" icon="tune" onClick={() => nav(R.coachGuide)}>
            Adjust My Preferences
          </Button>
          <Button variant="soft" icon="refresh" onClick={() => nav(R.coachGuide)}>
            Show Other Paths
          </Button>
        </div>
      </section>
    </Screen>
  );
}
