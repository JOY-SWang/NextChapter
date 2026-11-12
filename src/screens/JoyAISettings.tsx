import { forwardRef, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/Screen';
import { Icon } from '../components/Icon';
import { JoyAI, JoyAIAvatar, Sparkle } from '../components/JoyAI';
import { SectionNav, useSectionNav } from '../components/SectionNav';
import { ChoiceSeg, IconTile, Pill, Toggle, TopicChip } from '../components/ui';
import { useApp } from '../context/AppContext';
import { DEFAULT_TALK_PREFS, MAX_TONES, REPLY_LANGUAGES, REPLY_LENGTHS, SAMPLE_REPLY, TONE_OPTIONS, sameTalkPrefs, type ToneId } from '../data/content';
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

/** Section nav: each item scrolls to its section; Overview is the top of the page. */
const SECTION_IDS = ['overview', 'knowledge', 'about', 'preferences'] as const;
type SectionId = (typeof SECTION_IDS)[number];
const SECTION_ITEMS: { id: SectionId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'about', label: 'About You' },
  { id: 'preferences', label: 'Preferences' },
];

interface SectionProps {
  id: string;
  n: number;
  title: string;
  icon: string;
  tone: 'green' | 'terracotta';
  desc: ReactNode;
  action?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  children?: ReactNode;
}

const Section = forwardRef<HTMLElement, SectionProps>(function Section({ id, n, title, icon, tone, desc, action, onAction, actionDisabled, children }, ref) {
  const titleId = `joyai-${id}-title`;
  return (
    <section ref={ref} className="card card-card stack-12" aria-labelledby={titleId}>
      <div className="row gap-12 align-start">
        <IconTile icon={icon} tone={tone} size={44} radius={22} />
        <div className="grow stack-4">
          {/* Focus target for the section nav. */}
          <h2 id={titleId} className="t-h4" tabIndex={-1} data-section-title>
            {n}. {title}
          </h2>
          <p className="t-caption muted">{desc}</p>
        </div>
        {action && (
          <button type="button" className="add-pill soft" onClick={onAction} disabled={actionDisabled}>
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
});

/**
 * 3. How I Talk With You (the Preferences tab) — behaviour, not content: tone, reply length and
 * language, proactive check-ins and boundaries. The chosen tones are the tags in the header; the
 * sample reply shows the effect; check-ins and language also change JoyAI's check-in on Home.
 */
const TalkPreferences = forwardRef<HTMLElement>(function TalkPreferences(_, ref) {
  const { talkPrefs: prefs, updateTalkPrefs } = useApp();
  const [draft, setDraft] = useState('');
  // Bumped when a 4th tone is tapped: the hint explains the limit for a moment (chips never look disabled).
  const [limitHit, setLimitHit] = useState(0);
  useEffect(() => {
    if (!limitHit) return;
    const t = window.setTimeout(() => setLimitHit(0), 2600);
    return () => window.clearTimeout(t);
  }, [limitHit]);
  const lead = TONE_OPTIONS.find((t) => t.id === prefs.tones[prefs.tones.length - 1]);
  const lang = REPLY_LANGUAGES.find((l) => l.id === prefs.language)?.lang ?? 'en';
  const sample = [lead?.opener[prefs.language], SAMPLE_REPLY[prefs.language][prefs.length]].filter(Boolean).join(prefs.language === 'en' ? ' ' : '');

  const toggleTone = (id: ToneId) => {
    const on = prefs.tones.includes(id);
    if (!on && prefs.tones.length >= MAX_TONES) {
      setLimitHit((n) => n + 1);
      return;
    }
    setLimitHit(0);
    updateTalkPrefs((p) => ({ tones: on ? p.tones.filter((t) => t !== id) : [...p.tones, id] }));
  };

  const addBoundary = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim().replace(/\s+/g, ' ');
    if (!text) return;
    updateTalkPrefs((p) => (p.boundaries.some((b) => b.toLowerCase() === text.toLowerCase()) ? {} : { boundaries: [...p.boundaries, text] }));
    setDraft('');
  };
  const removeBoundary = (text: string) => updateTalkPrefs((p) => ({ boundaries: p.boundaries.filter((b) => b !== text) }));

  return (
    <Section
      ref={ref}
      id="preferences"
      n={3}
      title="How I Talk With You"
      icon="chat-lines"
      tone="terracotta"
      desc="Tell me how you’d like me to talk with you."
      action="Reset"
      onAction={() => {
        updateTalkPrefs(DEFAULT_TALK_PREFS);
        setDraft('');
      }}
      actionDisabled={sameTalkPrefs(prefs, DEFAULT_TALK_PREFS)}
    >
      <div className="pref-group">
        <div className="pref-head">
          <h3 id="pref-tone" className="pref-label">
            Tone
          </h3>
          <span id="pref-tone-hint" className={`pref-hint ${limitHit ? 'is-warn' : ''}`} aria-live="polite">
            {limitHit ? `Up to ${MAX_TONES} — remove one first` : `Pick up to ${MAX_TONES}`}
          </span>
        </div>
        <div className="wrap gap-8" role="group" aria-labelledby="pref-tone" aria-describedby="pref-tone-hint">
          {TONE_OPTIONS.map((t) => {
            const on = prefs.tones.includes(t.id);
            return (
              <button key={t.id} type="button" className={`choice-chip ${on ? 'is-on' : ''}`} aria-pressed={on} onClick={() => toggleTone(t.id)}>
                {on && <Icon name="check" size={15} stroke={2.4} />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pref-group">
        <h3 id="pref-length" className="pref-label">
          Reply length
        </h3>
        <ChoiceSeg name="reply-length" labelledBy="pref-length" options={REPLY_LENGTHS} value={prefs.length} onChange={(length) => updateTalkPrefs({ length })} />
      </div>

      <div className="pref-group">
        <h3 id="pref-language" className="pref-label">
          Reply language
        </h3>
        <ChoiceSeg name="reply-language" labelledBy="pref-language" options={REPLY_LANGUAGES} value={prefs.language} onChange={(language) => updateTalkPrefs({ language })} />
      </div>

      <div className="pref-group">
        <div className="turn turn-joyai talk-preview">
          <span aria-hidden>
            <JoyAIAvatar size={32} />
          </span>
          <div className="turn-body" aria-live="polite" aria-atomic="true">
            <span className="turn-name">Sample reply</span>
            <p key={sample} className="bubble bubble-joyai talk-bubble" lang={lang}>
              {sample}
            </p>
          </div>
        </div>
      </div>

      <div className="pref-group pref-switch">
        <div className="grow stack-2">
          <span className="pref-label">Proactive check-ins</span>
          <span className="t-caption muted">{prefs.proactive ? 'I may start a chat to check on your plan or remind you of next steps.' : 'I’ll wait for you to start a chat.'}</span>
        </div>
        <Toggle on={prefs.proactive} onChange={(proactive) => updateTalkPrefs({ proactive })} label="Proactive check-ins" />
      </div>

      <div className="pref-group">
        <div className="pref-head">
          <h3 id="pref-boundaries" className="pref-label">
            Boundaries
          </h3>
          <span className="pref-hint">Things I should avoid</span>
        </div>
        {prefs.boundaries.length > 0 && (
          <ul className="stack-8" aria-labelledby="pref-boundaries">
            {prefs.boundaries.map((b) => (
              <li key={b} className="boundary-row">
                <Icon name="shield" size={18} color="var(--tertiary-key)" />
                <span className="grow">{b}</span>
                <button type="button" className="icon-btn round boundary-remove" aria-label={`Remove boundary: ${b}`} onClick={() => removeBoundary(b)}>
                  <Icon name="close" size={15} stroke={2} />
                </button>
              </li>
            ))}
          </ul>
        )}
        <form className="boundary-add" onSubmit={addBoundary}>
          <Icon name="plus" size={18} stroke={2} color="var(--on-surface-variant)" />
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a boundary…" aria-label="New boundary" maxLength={80} enterKeyHint="done" />
          <button type="submit" className="add-pill soft" disabled={!draft.trim()}>
            Add
          </button>
        </form>
      </div>

      <div className="info-note">
        <Icon name="info" size={16} color="var(--outline)" />
        <span>Preferences don’t change what I know or recommend. They change how I say it — tone, detail, language and timing.</span>
      </div>
    </Section>
  );
});

/**
 * JoyAI Settings — personalization made visible. JoyAI doesn't "learn a new profession":
 * it picks more relevant knowledge, tools and resources based on Sarah's profile (Knowledge, About You),
 * and talks the way she prefers (Preferences).
 */
export function JoyAISettings() {
  const nav = useNavigate();
  const { talkPrefs } = useApp();
  const sections = useSectionNav(SECTION_IDS);
  return (
    <Screen top="status" label="JoyAI settings" contentClassName="joyai-settings">
      <div className="row-between">
        <button type="button" className="icon-btn icon-btn-soft round" aria-label="Close" onClick={() => nav(-1)}>
          <Icon name="close" size={20} stroke={2} />
        </button>
        <span className="t-h2">Your JoyAI</span>
        <button type="button" className="add-pill soft" onClick={() => sections.go('preferences')}>
          <Icon name="gear" size={16} /> Customize
        </button>
      </div>

      <div ref={sections.sectionRef('overview')} className="row gap-12">
        <div className="joyai-mini-hero">
          <span className="mound mound-xs" />
          <JoyAI mood="wink" size={134} />
          <span className="speech speech-soft speech-xs">Hi! I’m JoyAI!</span>
          <Sparkle size={12} style={{ position: 'absolute', right: 0, top: 36 }} />
        </div>
        <div className="grow stack-8">
          <h1 className="t-h2" tabIndex={-1} data-section-title>
            Your personal AI Coach
          </h1>
          <p className="t-caption muted">I personalise our chats and pick relevant knowledge to support your next chapter.</p>
          {/* The tone chosen under Preferences, plus "Always adapting". */}
          <div className="wrap gap-6">
            {TONE_OPTIONS.filter((t) => talkPrefs.tones.includes(t.id)).map((t) => (
              <Pill key={t.id} tone="neutral" className="tone-tag" style={{ color: t.color }}>
                {t.label}
              </Pill>
            ))}
            <Pill tone="neutral" style={{ color: 'var(--primary-key)' }}>
              Always adapting
            </Pill>
          </div>
        </div>
      </div>

      <SectionNav nav={sections} items={SECTION_ITEMS} label="JoyAI settings sections" />

      <Section
        ref={sections.sectionRef('knowledge')}
        id="knowledge"
        n={1}
        title="My Knowledge Focus"
        icon="brain"
        tone="terracotta"
        action="Edit"
        desc="I bring relevant knowledge and resources based on your background and goals."
      >
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

      <Section
        ref={sections.sectionRef('about')}
        id="about"
        n={2}
        title="What I Know About You"
        icon="user"
        tone="terracotta"
        action="Edit all"
        desc="What I’ve noted from our conversations. You can edit or remove any item."
      >
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

      <TalkPreferences ref={sections.sectionRef('preferences')} />

      <Section
        id="help"
        n={4}
        title="How I Can Help You Now"
        icon="target"
        tone="green"
        action="Update"
        onAction={() => nav(R.coach)}
        desc="I can connect your leadership and mentoring experience with your interest in yoga teaching, and suggest learning paths, community opportunities and realistic next steps."
      />

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
