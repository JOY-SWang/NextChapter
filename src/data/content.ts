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
export const STRENGTH_AXES: RadarAxis[] = [
  { label: 'Planning', sub: '95%', value: 0.95 },
  { label: 'Communication', sub: '88%', value: 0.88 },
  { label: 'Mentoring', sub: '92%', value: 0.92 },
  { label: 'Adaptability', sub: '80%', value: 0.8 },
  { label: 'Wellness', sub: '72%', value: 0.72 },
  { label: 'Problem-solving', sub: '86%', value: 0.86 },
];

/** Me page "Strengths balance" (same data, rotated as in Figma). */
export const BALANCE_AXES: RadarAxis[] = [
  { label: 'Mentoring', sub: '92%', value: 0.92 },
  { label: 'Planning', sub: '95%', value: 0.95 },
  { label: 'Communication', sub: '88%', value: 0.88 },
  { label: 'Wellness', sub: '72%', value: 0.72 },
  { label: 'Problem-solving', sub: '86%', value: 0.86 },
  { label: 'Adaptability', sub: '80%', value: 0.8 },
];

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
