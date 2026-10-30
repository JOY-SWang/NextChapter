import { useNavigate } from 'react-router-dom';
import { Icon } from './Icon';
import { R } from '../routes';

const STEPS = [
  { label: 'Your Story', to: R.coachGuide },
  { label: 'Your Strengths', to: R.strengths },
  { label: 'Your Possibilities', to: R.possibilities },
];

/** NC / Journey Steps — the 3-step Discovery Journey (Story → Strengths → Possibilities). */
export function JourneySteps({ current }: { current: 1 | 2 | 3 }) {
  const nav = useNavigate();
  return (
    <ol className="journey" aria-label={`Discovery journey, step ${current} of 3`}>
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const state = idx < current ? 'done' : idx === current ? 'current' : 'upcoming';
        const clickable = idx <= current;
        return (
          <li key={s.label} className={`journey-step is-${state}`}>
            <button type="button" className="unstyled journey-btn" disabled={!clickable} onClick={() => clickable && nav(s.to)} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="journey-dot">{state === 'done' ? <Icon name="check" size={18} stroke={2.4} /> : idx}</span>
              <span className="journey-label">{s.label}</span>
            </button>
            {idx < 3 && <Icon name="chevron-right" size={16} stroke={2} className="journey-chev" />}
          </li>
        );
      })}
    </ol>
  );
}
