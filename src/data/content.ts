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
