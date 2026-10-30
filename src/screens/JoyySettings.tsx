import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { Joyy, Sparkle } from '../components/Joyy';
import { IconTile, Pill, TopicChip } from '../components/ui';
import { R } from '../routes';

const TOPICS: { label: string; tone: 'green' | 'neutral' | 'amber' | 'terracotta' }[] = [
  { label: 'Tech Leadership', tone: 'green' },
  { label: 'Project Management', tone: 'neutral' },
  { label: 'Yoga Teaching', tone: 'green' },
  { label: 'Wellness', tone: 'green' },
  { label: 'Mentoring', tone: 'amber' },
  { label: 'Career Transition', tone: 'terracotta' },
];

const FACTS = [
  { icon: 'briefcase', color: 'var(--primary-key)', title: '20 years in technology', sub: 'Project & team leadership' },
  { icon: 'leaf', color: 'var(--primary-key)', title: '8 years practising yoga', sub: 'Regular practice, interested in teaching', isNew: true },
  { icon: 'clock', color: 'var(--on-surface)', title: 'Around 8 hours per week', sub: 'To keep a sustainable rhythm' },
  { icon: 'heart', color: 'var(--tertiary-key)', title: 'Values flexibility & meaningful work', sub: 'More time for yoga, family and growth' },
];

function Section({ n, title, icon, tone, action, desc, children }: { n: number; title: string; icon: string; tone: 'green' | 'terracotta'; action?: string; desc: string; children?: React.ReactNode }) {
  return (
    <section className="card card-card stack-12">
      <div className="row gap-12 align-start">
        <IconTile icon={icon} tone={tone} size={44} radius={22} />
        <div className="grow stack-4">
          <h2 className="t-h4">
            {n}. {title}
          </h2>
          <p className="t-caption muted">{desc}</p>
        </div>
        {action && (
          <button type="button" className="add-pill soft">
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

/**
 * Joyy Settings — personalization made visible. Joyy doesn't "learn a new profession":
 * it picks more relevant knowledge, tools and resources based on Sarah's profile.
 */
export function JoyySettings() {
  const nav = useNavigate();
  const [tab, setTab] = useState(0);
  return (
    <Screen top="status" label="Joyy settings" contentClassName="joyy-settings">
      <div className="row-between">
        <button type="button" className="icon-btn icon-btn-soft round" aria-label="Close" onClick={() => nav(-1)}>
          <Icon name="close" size={20} stroke={2} />
        </button>
        <span className="t-h2">Your Joyy</span>
        <button type="button" className="add-pill soft">
          <Icon name="gear" size={16} /> Customize
        </button>
      </div>

      <div className="row gap-12">
        <div className="joyy-mini-hero">
          <span className="mound mound-xs" />
          <Joyy mood="wink" size={134} />
          <span className="speech speech-soft speech-xs">Hi! I’m Joyy!</span>
          <Sparkle size={12} style={{ position: 'absolute', right: 0, top: 36 }} />
        </div>
        <div className="grow stack-8">
          <h1 className="t-h2">Your personal AI Coach</h1>
          <p className="t-caption muted">I personalise our chats and pick relevant knowledge to support your next chapter.</p>
          <div className="wrap gap-6">
            <Pill tone="neutral" style={{ color: 'var(--tertiary-key)' }}>
              Curious
            </Pill>
            <Pill tone="neutral" style={{ color: 'var(--primary-key)' }}>
              Supportive
            </Pill>
            <Pill tone="neutral" style={{ color: 'var(--secondary-text)' }}>
              Practical
            </Pill>
            <Pill tone="neutral" style={{ color: 'var(--primary-key)' }}>
              Always adapting
            </Pill>
          </div>
        </div>
      </div>

      <div className="seg-tabs pill-tabs" role="tablist">
        {['Overview', 'Knowledge', 'About You', 'Preferences'].map((t, i) => (
          <button key={t} type="button" role="tab" aria-selected={i === tab} className={i === tab ? 'is-on' : ''} onClick={() => setTab(i)}>
            {t}
          </button>
        ))}
      </div>

      <Section n={1} title="My Knowledge Focus" icon="brain" tone="terracotta" action="Edit" desc="I bring relevant knowledge and resources based on your background and goals.">
        <div className="wrap gap-6">
          {TOPICS.map((t) => (
            <TopicChip key={t.label} label={t.label} tone={t.tone} />
          ))}
          <TopicChip label="Add topic" add />
        </div>
        <div className="info-note">
          <Icon name="info" size={16} color="var(--outline)" />
          <span>Topics don’t make me an expert in a new field. They help me choose more relevant resources, tools and suggestions for you.</span>
        </div>
      </Section>

      <Section n={2} title="What I Know About You" icon="user" tone="terracotta" action="Edit all" desc="What I’ve noted from our conversations. You can edit or remove any item.">
        <div className="stack-10">
          {FACTS.map((f) => (
            <div key={f.title} className="fact-row">
              <Icon name={f.icon} size={22} color={f.color} />
              <span className="grow stack-2">
                <span className="row gap-6">
                  <strong className="t-label-lg">{f.title}</strong>
                  {f.isNew && <span className="new-badge">NEW</span>}
                </span>
                <span className="t-caption muted">{f.sub}</span>
              </span>
              <Icon name="pencil" size={18} color="var(--on-surface-variant)" />
            </div>
          ))}
          <div className="fact-add">
            <Icon name="plus" size={18} stroke={2} /> <strong>Add a detail</strong> <span className="outline">e.g. location, budget, family</span>
          </div>
        </div>
      </Section>

      <section className="card card-card stack-12">
        <div className="row gap-12 align-start">
          <IconTile icon="target" tone="green" size={44} radius={22} />
          <div className="grow stack-4">
            <h2 className="t-h4">3. How I Can Help You Now</h2>
            <p className="t-caption muted">
              I can connect your leadership and mentoring experience with your interest in yoga teaching, and suggest learning paths, community
              opportunities and realistic next steps.
            </p>
          </div>
          <button type="button" className="add-pill soft" onClick={() => nav(R.coach)}>
            Update
          </button>
        </div>
      </section>

      <button type="button" className="unstyled card card-mid history-row">
        <Icon name="chart" size={24} stroke={2} color="var(--primary-key)" />
        <span className="grow stack-2">
          <span className="t-h4">Personalization history</span>
          <span className="t-caption muted">See what I’ve updated from our chats, and undo anything.</span>
        </span>
        <Icon name="chevron-right" size={20} stroke={2} color="var(--outline)" />
      </button>
    </Screen>
  );
}
