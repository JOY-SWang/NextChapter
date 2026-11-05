import { Icon } from './Icon';
import { Pill, ProgressBar } from './ui';

/**
 * "Your Yoga Teaching Journey" — Day 12 of 100 progress card (Home, My Day).
 * Pass `onClick` to make the whole card a link (Home → Roadmap).
 */
export function JourneyProgress({ onClick }: { onClick?: () => void }) {
  const body = (
    <>
      <span className="row gap-8">
        <Icon name="sprout" size={18} stroke={2} color="var(--primary-key)" />
        <strong className="t-label-lg">Your Yoga Teaching Journey</strong>
        {onClick && <Icon name="chevron-right" size={18} color="var(--outline)" style={{ marginLeft: 'auto' }} />}
      </span>
      <span className="row-between">
        <span className="t-caption muted">Day 12 of 100 · Explore &amp; Validate</span>
        <Pill tone="green">Active</Pill>
      </span>
      <ProgressBar value={0.12} />
    </>
  );
  if (!onClick) return <section className="card card-card stack-8 journey-progress">{body}</section>;
  return (
    <button type="button" className="unstyled card card-card stack-8 journey-progress is-link" onClick={onClick} aria-label="Your Yoga Teaching Journey, day 12 of 100 — open Roadmap">
      {body}
    </button>
  );
}
