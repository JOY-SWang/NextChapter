import { useState, type CSSProperties } from 'react';
import { OverlayFrame } from './OverlayFrame';
import { useApp } from '../context/AppContext';
import { Icon } from '../components/Icon';
import { RadarChart } from '../components/RadarChart';
import { Button } from '../components/ui';
import {
  BALANCE_ORDER,
  JOYY_STRENGTHS,
  STRENGTH_META,
  sameStrengths,
  strengthLevel,
  toAxes,
  type StrengthKey,
  type StrengthValues,
} from '../data/content';

const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

/** One strength: name, level word, value, and a slider with −/+ buttons for precise, large-target changes. */
function StrengthRow({ k, value, joyy, onChange }: { k: StrengthKey; value: number; joyy: number; onChange: (v: number) => void }) {
  const meta = STRENGTH_META[k];
  const changed = value !== joyy;
  return (
    <li className={`edit-row ${changed ? 'is-changed' : ''}`}>
      <div className="edit-row-head">
        <span className="icon-tile tile-neutral" style={{ width: 36, height: 36, borderRadius: 10 }}>
          <Icon name={meta.icon} size={18} />
        </span>
        <span className="grow stack-0">
          <strong className="t-label-lg">{meta.label}</strong>
          <span className="t-tiny muted">{strengthLevel(value)}</span>
          {changed && (
            <button type="button" className="unstyled edit-revert" onClick={() => onChange(joyy)}>
              Joyy suggested {joyy}% · Undo
            </button>
          )}
        </span>
        <span className="edit-value" aria-hidden>
          {value}%
        </span>
      </div>
      <div className="edit-control">
        <button type="button" className="step-btn" aria-label={`Lower ${meta.label}`} disabled={value <= 0} onClick={() => onChange(clamp(value - 5))}>
          <Icon name="minus" size={18} stroke={2.2} />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value)))}
          aria-label={`${meta.label} level`}
          aria-valuetext={`${value}%, ${strengthLevel(value)}`}
          className="edit-slider"
          style={{ '--v': `${value}%`, '--j': `${joyy}%` } as CSSProperties}
        />
        <button type="button" className="step-btn" aria-label={`Raise ${meta.label}`} disabled={value >= 100} onClick={() => onChange(clamp(value + 5))}>
          <Icon name="plus" size={18} stroke={2.2} />
        </button>
      </div>
    </li>
  );
}

/**
 * Edit strengths (from the User page "Strengths balance · Edit").
 * Sarah adjusts the levels Joyy suggested; the preview compares her version with Joyy's.
 * Save updates her profile everywhere (User page, P3 strengths map); Cancel discards.
 */
export function EditStrengths() {
  const { strengths, saveStrengths, closeOverlay } = useApp();
  const [draft, setDraft] = useState<StrengthValues>(strengths);
  const dirty = !sameStrengths(draft, strengths);
  const isJoyy = sameStrengths(draft, JOYY_STRENGTHS);
  const set = (k: StrengthKey) => (v: number) => setDraft((d) => ({ ...d, [k]: v }));

  const save = () => {
    saveStrengths(draft);
    closeOverlay();
  };

  return (
    <OverlayFrame kind="sheet" label="Edit your strengths" panelClassName="edit-panel">
      <div className="edit-scroll">
        <span className="grabber" style={{ alignSelf: 'center' }} />
        <header className="edit-head">
          <div className="stack-4 grow">
            <h2 className="t-h2">Edit your strengths</h2>
            <p className="t-body muted">Joyy suggested these levels from your conversation. Move any that don’t feel right — Joyy will use your version from now on.</p>
          </div>
          <button type="button" className="icon-btn icon-btn-soft" aria-label="Close without saving" onClick={closeOverlay}>
            <Icon name="close" size={20} stroke={2} />
          </button>
        </header>

        <section className="edit-preview" aria-label="Preview">
          <RadarChart axes={toAxes(BALANCE_ORDER, draft, JOYY_STRENGTHS)} radius={72} mode="edit" ariaLabel="Preview of your edited strengths compared with Joyy’s assessment" />
          <div className="legend legend-center">
            <span>
              <i style={{ background: 'var(--primary-key)' }} /> Your levels
            </span>
            <span>
              <i className="legend-dashed" /> Joyy’s assessment
            </span>
          </div>
        </section>

        <ul className="edit-list">
          {BALANCE_ORDER.map((k) => (
            <StrengthRow key={k} k={k} value={draft[k]} joyy={JOYY_STRENGTHS[k]} onChange={set(k)} />
          ))}
        </ul>
      </div>

      <footer className="edit-actions">
        <Button variant="primary" icon="check" disabled={!dirty} onClick={save}>
          Save changes
        </Button>
        <div className="row gap-8">
          <Button variant="soft" size="sm" onClick={closeOverlay}>
            Cancel
          </Button>
          <Button variant="ghost" size="sm" icon="refresh" disabled={isJoyy} onClick={() => setDraft(JOYY_STRENGTHS)}>
            Reset to Joyy’s
          </Button>
        </div>
      </footer>
    </OverlayFrame>
  );
}
