/**
 * Shared content, copied from the Figma file (Page 4 Job Transition).
 * The persona is Sarah, 48 — 20 years leading projects and teams in tech,
 * exploring yoga teaching with ~8 hours a week.
 */
import type { RadarAxis } from '../components/RadarChart';

export const KNOWLEDGE_TOPICS: { label: string; tone: 'green' | 'neutral' | 'amber' | 'terracotta'; isNew?: boolean }[] = [
  { label: 'Tech Leadership', tone: 'green' },
  { label: 'Project Management', tone: 'neutral' },
  { label: 'Mentoring', tone: 'amber' },
  { label: 'Career Transition', tone: 'terracotta' },
  { label: 'Yoga Teaching', tone: 'green', isNew: true },
  { label: 'Wellness', tone: 'green', isNew: true },
];

/* ───────────── How JoyAI talks with Sarah (JoyAI Settings → Preferences) ───────────── */
/* Behaviour, not content: these change how JoyAI talks, never what it knows or recommends. */
export type ToneId = 'curious' | 'supportive' | 'practical' | 'direct' | 'gentle' | 'playful';
export type ReplyLength = 'brief' | 'balanced' | 'detailed';
export type ReplyLanguage = 'en' | 'zh-Hans';

export interface TalkPrefs {
  /** Up to MAX_TONES tones, in the order they were picked (the latest one leads the sample reply). */
  tones: ToneId[];
  length: ReplyLength;
  language: ReplyLanguage;
  /** JoyAI may start a conversation itself — e.g. the check-in card on Home. */
  proactive: boolean;
  /** Things JoyAI should avoid, in Sarah's own words. */
  boundaries: string[];
}

export const MAX_TONES = 3;

/** Tone options. `color` tints the matching tag in the JoyAI Settings header; `opener` starts the sample reply. */
export const TONE_OPTIONS: { id: ToneId; label: string; color: string; opener: Record<ReplyLanguage, string> }[] = [
  { id: 'curious', label: 'Curious', color: 'var(--tertiary-key)', opener: { en: 'Curious how teaching would feel?', 'zh-Hans': '想知道教课是什么感觉吗？' } },
  { id: 'supportive', label: 'Supportive', color: 'var(--primary-key)', opener: { en: 'You’re making steady progress, Sarah.', 'zh-Hans': 'Sarah，你一直在稳步前进。' } },
  { id: 'practical', label: 'Practical', color: 'var(--secondary-text)', opener: { en: 'Let’s keep it concrete.', 'zh-Hans': '我们来点实际的。' } },
  { id: 'direct', label: 'Direct', color: 'var(--primary-strong)', opener: { en: 'I’ll be direct.', 'zh-Hans': '我就直说了。' } },
  { id: 'gentle', label: 'Gentle', color: 'var(--tertiary-key)', opener: { en: 'No pressure — just one small step.', 'zh-Hans': '不着急，只是一小步。' } },
  { id: 'playful', label: 'Playful', color: 'var(--secondary-text)', opener: { en: 'Time for a fun experiment!', 'zh-Hans': '来做个有趣的小实验吧！' } },
];

export const REPLY_LENGTHS: { id: ReplyLength; label: string }[] = [
  { id: 'brief', label: 'Brief' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'detailed', label: 'Detailed' },
];

export const REPLY_LANGUAGES: { id: ReplyLanguage; label: string; lang: string }[] = [
  { id: 'en', label: 'English', lang: 'en' },
  { id: 'zh-Hans', label: '简体中文', lang: 'zh-Hans' },
];

/** The same advice at each length, for the "Sample reply" preview. */
export const SAMPLE_REPLY: Record<ReplyLanguage, Record<ReplyLength, string>> = {
  en: {
    brief: 'Book one trial class this week.',
    balanced: 'Book one trial class this week — it’s the quickest way to feel what teaching is like. Want me to find a time?',
    detailed:
      'Book one trial class this week. Watching how a teacher paces and cues a class shows you what training will cover, and it fits easily into your 8 hours a week. Afterwards, we can compare two teacher-training options side by side.',
  },
  'zh-Hans': {
    brief: '这周先预约一节体验课。',
    balanced: '这周先预约一节体验课——这是感受教课最快的方式。要我帮你找个时间吗？',
    detailed: '这周先预约一节体验课。看看老师怎样把控节奏、给出口令，你就能知道培训会学些什么，而且正好放进你每周 8 小时的安排。之后，我们可以把两个教师培训项目放在一起比较。',
  },
};

/** JoyAI's check-in on Home, in Sarah's reply language. */
export const CHECKIN_MESSAGE: Record<ReplyLanguage, string> = {
  en: 'Sarah, you explored yoga teaching yesterday! How are you feeling about it today?',
  'zh-Hans': 'Sarah，你昨天了解了瑜伽教学！今天感觉怎么样？',
};

export const DEFAULT_TALK_PREFS: TalkPrefs = {
  tones: ['curious', 'supportive', 'practical'],
  length: 'balanced',
  language: 'en',
  proactive: true,
  boundaries: ['Don’t rush my decisions', 'Ask before bringing up money', 'No messages after 9 pm'],
};

export const sameTalkPrefs = (a: TalkPrefs, b: TalkPrefs) =>
  a.length === b.length &&
  a.language === b.language &&
  a.proactive === b.proactive &&
  a.tones.join() === b.tones.join() &&
  a.boundaries.join('\n') === b.boundaries.join('\n');

/** P3 "Your strengths map" — same six dimensions and values as the Me page. */
/* ───────────── Sarah's strengths (editable from the User page) ───────────── */
export type StrengthKey = 'planning' | 'communication' | 'mentoring' | 'adaptability' | 'wellness' | 'problemSolving';
export type StrengthValues = Record<StrengthKey, number>; // 0–100

export const STRENGTH_META: Record<StrengthKey, { label: string; icon: string; title: string; sub: string }> = {
  planning: { label: 'Planning', icon: 'layers', title: 'Project Planning & Execution', sub: 'Pacing, systems & on-time delivery' },
  communication: { label: 'Communication', icon: 'chat-lines', title: 'Communication & Facilitation', sub: 'Translating chaos into quiet clarity' },
  mentoring: { label: 'Mentoring', icon: 'people', title: 'Leadership & Mentoring', sub: 'Psychological safety & unblocking others' },
  adaptability: { label: 'Adaptability', icon: 'refresh', title: 'Adaptability', sub: 'Steady through change' },
  wellness: { label: 'Wellness', icon: 'lotus', title: 'Yoga & Wellness Practice', sub: '8 years of personal practice' },
  problemSolving: { label: 'Problem-solving', icon: 'lightbulb', title: 'Problem-solving', sub: 'Untangling complex situations' },
};

/**
 * Evidence behind each strength (what JoyAI heard in the AI Coach chat) and how it shows up.
 * Shared by the P3 strength details and the User page "Strengths & evidence" cards.
 * Sarah is a sample persona — this is illustrative content, not real user data.
 */
export const STRENGTH_EVIDENCE: Record<StrengthKey, { evidence: string; tags: string[] }> = {
  mentoring: {
    evidence: '“Mentored 35+ tech managers through organizational volatility; certified internal coaching facilitator for mid-tier transitions.”',
    tags: ['1-on-1 Dialogue', 'Empathetic Listening', 'Psychological Safety'],
  },
  planning: {
    evidence: '“20 years orchestrating multi-million budgets, complex program rollouts, and calming stakeholder anxiety during critical go-lives.”',
    tags: ['Budget Stewardship', 'Milestone Roadmapping', 'Boundary Setting'],
  },
  communication: {
    evidence: '“Experienced keynote presenter, interactive workshop host for cross-functional leaders, and creator of quiet consensus.”',
    tags: ['Story Crafting', 'Conflict De-escalation'],
  },
  wellness: {
    evidence: '“8 years of personal yoga practice; now learning anatomy basics and breathwork.”',
    tags: ['Mindful Breath', 'Yoga Asana', 'Basic Yoga Anatomy'],
  },
  adaptability: {
    evidence: '“Kept teams steady through three reorganisations and a platform migration, adjusting plans without losing momentum.”',
    tags: ['Calm Through Change', 'Re-planning', 'Learning Fast'],
  },
  problemSolving: {
    evidence: '“Often the one asked to untangle stuck projects — breaking big unknowns into small, testable next steps.”',
    tags: ['Breaking Down Problems', 'Root-cause Thinking', 'Trade-off Calls'],
  },
};

/** JoyAI's assessment from the AI Coach conversation (the starting point the user can edit). */
export const JOYAI_STRENGTHS: StrengthValues = { planning: 95, communication: 88, mentoring: 92, adaptability: 80, wellness: 72, problemSolving: 86 };

/** Axis order of the P3 strengths map and of the User page balance chart (rotated as in Figma). */
export const STRENGTH_ORDER: StrengthKey[] = ['planning', 'communication', 'mentoring', 'adaptability', 'wellness', 'problemSolving'];
export const BALANCE_ORDER: StrengthKey[] = ['mentoring', 'planning', 'communication', 'wellness', 'problemSolving', 'adaptability'];

export const toAxes = (order: StrengthKey[], values: StrengthValues, compare?: StrengthValues): RadarAxis[] =>
  order.map((k) => ({ label: STRENGTH_META[k].label, sub: `${values[k]}%`, value: values[k] / 100, compare: compare ? compare[k] / 100 : undefined }));

export const strengthLevel = (v: number) => (v >= 90 ? 'Very strong' : v >= 80 ? 'Strong' : v >= 60 ? 'Developing' : 'Emerging');

/** The two highest strengths, named in chart order (e.g. "Mentoring + Planning"). */
export const strongestPairing = (values: StrengthValues) => {
  const top = [...BALANCE_ORDER].sort((a, b) => values[b] - values[a]).slice(0, 2);
  return BALANCE_ORDER.filter((k) => top.includes(k)).map((k) => STRENGTH_META[k].label).join(' + ');
};

export const sameStrengths = (a: StrengthValues, b: StrengthValues) => STRENGTH_ORDER.every((k) => a[k] === b[k]);

/** P5 "Strengths vs. role needs" for Yoga Instructor. */
export const FIT_AXES: RadarAxis[] = [
  { label: 'Planning & pacing', value: 0.95, compare: 0.72 },
  { label: 'Communication', sub: '& cueing', value: 0.88, compare: 0.9 },
  { label: 'Mentoring', sub: '& empathy', value: 0.92, compare: 0.82 },
  { label: 'Calm under pressure', sub: 'Emotional presence', value: 0.86, compare: 0.6 },
  { label: 'Business skills', sub: 'Finding clients', value: 0.62, compare: 0.62 },
  { label: 'Body knowledge', sub: 'Anatomy & alignment', value: 0.3, compare: 0.95 },
];

export const PATHS = [
  {
    id: 'yoga',
    title: 'Yoga Instructor',
    fit: 86,
    badge: { label: 'Interest-aligned', icon: 'heart', color: 'var(--tertiary-key)' },
    photo: 'path-yoga' as const,
    body: 'Turn your passion for wellness and mentoring into a fulfilling second career, blending mindful movement with personal growth.',
    why: 'Mentoring + Mindful Communication + Practiced Yoga Rhythm',
    facts: [
      { icon: 'clock', text: 'Time commitment: ~8 hrs/wk' },
      { icon: 'calendar', text: 'Exploration plan: 100 days' },
      { icon: 'flag', text: 'Next step: Trial class & talk to instructors', strong: true },
    ],
    primary: true,
  },
  {
    id: 'mentor',
    title: 'Career Mentor',
    fit: 94,
    badge: { label: 'Experience-Leveraged', icon: 'briefcase', color: 'var(--primary-strong)' },
    photo: 'path-mentor' as const,
    body: 'Support early-to-mid career professionals navigating milestones using your rich 20-year tech leadership depth.',
    why: 'Executive Leadership + Industry Depth + Active Listening',
    tags: [
      { icon: 'clock', text: 'Flexible hours' },
      { icon: 'briefcase', text: 'Independent consulting' },
      { icon: 'wallet', text: 'Good hourly rate' },
    ],
  },
  {
    id: 'facilitator',
    title: 'Community Workshop Facilitator',
    fit: 89,
    badge: { label: 'Purpose-Driven', icon: 'sprout', color: 'var(--secondary-text)' },
    photo: 'path-facilitator' as const,
    body: 'Combine your organizational expertise and facilitation skills with meaningful local community and civic initiatives.',
    why: 'Planning + Workshop Facilitation + Deep Empathy',
    tags: [
      { icon: 'pin', text: 'Local impact' },
      { icon: 'clock', text: 'Part-time flexible' },
      { icon: 'heart', text: 'Meaningful' },
    ],
  },
];
