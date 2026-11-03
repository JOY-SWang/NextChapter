import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Photo, type PhotoName } from '../components/Photo';
import { Button, FilterChips, IconTile, Overline, Pill, ProgressBar } from '../components/ui';
import { useApp, type OverlayId } from '../context/AppContext';
import { R } from '../routes';

interface Rec {
  kind: string;
  kindIcon: string;
  meta: string;
  eyebrow: string;
  title: string;
  photo: PhotoName;
  body: string;
  footIcon: string;
  foot: string;
  cta: string;
  overlay?: OverlayId;
}

const RECS: Rec[] = [
  {
    kind: 'Experience',
    kindIcon: 'sparkle',
    meta: '45 mins',
    eyebrow: 'GENTLE INTRODUCTION',
    title: 'Try a Beginner Yoga Class',
    photo: 'class-beginner',
    body: 'Step onto the mat with zero expectations. Experience standard breath sequences and restorative postures in an accepting, low-pressure studio circle.',
    footIcon: 'pin',
    foot: 'Lotus Bloom Studio · 1.9 km',
    cta: 'Book Trial Class',
    overlay: 'trialClass',
  },
  {
    kind: 'Course',
    kindIcon: 'book',
    meta: 'Hybrid • 6 Weeks',
    eyebrow: 'ACCREDITED PATHWAY',
    title: 'Explore Yoga Teacher Training',
    photo: 'course-ytt',
    body: 'An overview module of 200-hour YTT foundations: anatomy, philosophies of mindfulness, and compassionate guidance tailored for career reinvention.',
    footIcon: 'verified',
    foot: 'Yoga Alliance Aligned',
    cta: 'View Syllabus',
  },
  {
    kind: 'Opportunity',
    kindIcon: 'heart',
    meta: '4 hrs / week',
    eyebrow: 'COMMUNITY EXCHANGE',
    title: 'Assistant Studio Helper',
    photo: 'studio-helper',
    body: 'Exchange greeting guests, setting calming ambiance, and tea prep for unlimited studio practice and quiet immersion in the wellness community.',
    footIcon: 'wallet',
    foot: 'Work-Trade Credit',
    cta: 'Inquire',
  },
  {
    kind: 'Opportunity',
    kindIcon: 'chat-lines',
    meta: '1-on-1 Chat',
    eyebrow: 'PEER MENTORSHIP',
    title: 'Connect with Yoga Instructors',
    photo: 'connect-instructors',
    body: 'Book a 30-minute chat with teachers who moved from corporate careers into teaching.',
    footIcon: 'people',
    foot: '3 Mentors Ready',
    cta: 'Book Chat',
    overlay: 'chatBooked',
  },
];

/** P4.2 - Explore Your Next Steps (Explore tab once a path is chosen). */
export function Discover() {
  const nav = useNavigate();
  const { openOverlay } = useApp();
  const [filter, setFilter] = useState(0);
  return (
    <Screen tab="discover" label="Explore your next steps" contentClassName="gap-20">
      <header className="page-head">
        <h1 className="t-h1">Explore Your Next Steps</h1>
        <p className="t-body-lg muted">Classes, courses and people that support Stage 1 of your plan.</p>
      </header>

      <section className="stack-6">
        <Overline>YOUR CHOSEN PATH</Overline>
        <div className="card card-card stack-12">
          <div className="row-between align-start">
            <div className="stack-6">
              <Pill tone="terracotta" icon="lotus">
                Wellness &amp; Somatics
              </Pill>
              <h2 className="t-h3">Your Yoga Journey</h2>
            </div>
            <div className="stack-0 align-end">
              <span className="t-h3">Day 12</span>
              <span className="t-label muted">of 100 days</span>
            </div>
          </div>
          <div className="stack-6">
            <ProgressBar value={0.12} tone="amber" />
            <div className="row-between t-label">
              <span className="muted">Stage 1: Explore &amp; Validate</span>
              <span className="strong-green">12% Completed</span>
            </div>
          </div>
          <div className="focus-box">
            <Icon name="lightbulb" size={20} color="var(--secondary-text)" />
            <div className="stack-2">
              <strong className="t-label-lg strong-green">Current Focus</strong>
              <span className="t-body muted">Try beginner classes and talk to working teachers before choosing any certification.</span>
            </div>
          </div>
          <Button variant="strong" icon="nav-plan" trailing="arrow-right" className="btn-split" onClick={() => nav(R.roadmap)}>
            Go to My Plan
          </Button>
        </div>
      </section>

      <section className="stack-12">
        <div className="row-between align-start">
          <div className="stack-2">
            <h2 className="t-h3">Recommended for You</h2>
            <p className="t-body muted">Matched to your 8 hours a week and your Stage 1 goals</p>
          </div>
          <Icon name="sparkle" size={20} color="var(--primary-muted)" />
        </div>
        <FilterChips items={['All', 'Courses', 'Experiences', 'Opportunities']} active={filter} onSelect={setFilter} />
        <div className="stack-20">
          {RECS.map((r) => (
            <article key={r.title} className="card card-card rec-card">
              <div className="rec-media">
                <Photo name={r.photo} alt={r.title} className="rec-photo" />
                <span className="rec-shade" />
                <div className="rec-tags">
                  <Pill tone="white" icon={r.kindIcon}>
                    {r.kind}
                  </Pill>
                  <Pill tone="white">{r.meta}</Pill>
                </div>
                <div className="rec-title">
                  <span className="t-overline" style={{ color: 'var(--primary-container)' }}>
                    {r.eyebrow}
                  </span>
                  <h3 className="t-h3 on-dark">{r.title}</h3>
                </div>
              </div>
              <div className="rec-body">
                <p className="t-body muted">{r.body}</p>
                <div className="row-between">
                  <span className="row gap-6 t-label muted">
                    <Icon name={r.footIcon} size={15} /> {r.foot}
                  </span>
                  <Button variant="soft" size="sm" block={false} onClick={() => r.overlay && openOverlay(r.overlay)}>
                    {r.cta}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="stack-12">
        <div className="stack-2">
          <h2 className="t-h3">Structured Exploration</h2>
          <p className="t-body muted">Browse available opportunities grouped by engagement depth</p>
        </div>
        {[
          ['book', 'Courses', '12 Available', 'neutral'],
          ['sparkle', 'Experiences', '8 Available', 'terracotta'],
          ['people', 'Opportunities', '5 Available', 'green'],
        ].map(([icon, title, n, tone]) => (
          <button key={title} type="button" className="unstyled card card-card browse-row">
            <IconTile icon={icon} tone={tone as 'neutral'} size={48} radius={12} />
            <span className="grow stack-4">
              <span className="t-h3">{title}</span>
              <span className="t-label muted">{n}</span>
            </span>
            <Icon name="chevron-right" size={20} color="var(--outline)" />
          </button>
        ))}
      </section>

      <section className="card card-low stack-12">
        <div className="row gap-12 align-start">
          <IconTile icon="lightbulb" tone="terracotta" size={36} radius={18} iconSize={18} />
          <div className="stack-4">
            <h2 className="t-h3">Why these recommendations?</h2>
            <p className="t-body muted">
              In your AI Coach conversation you mentioned mentoring, 8 years of yoga practice and a limit of 8 hours a week. These options start small,
              so you can test the waters before paying for training.
            </p>
          </div>
        </div>
        <div className="card card-card revisit-row">
          <span className="row gap-8 t-body muted">
            <Icon name="refresh" size={16} /> Interests changed?
          </span>
          <button type="button" className="unstyled row gap-4 t-label terracotta strongest" onClick={() => nav(R.possibilities)}>
            Explore Another Career Path <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </section>
    </Screen>
  );
}
