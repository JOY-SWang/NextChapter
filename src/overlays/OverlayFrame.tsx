import { useEffect, type ReactNode } from 'react';
import { useApp } from '../context/AppContext';

/** Scrim + container for modals, bottom sheets and the side drawer. Esc / scrim tap closes. */
export function OverlayFrame({ kind, label, children }: { kind: 'modal' | 'sheet' | 'drawer'; label: string; children: ReactNode }) {
  const { closeOverlay } = useApp();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeOverlay();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeOverlay]);
  return (
    <div className={`overlay overlay-${kind}`} role="dialog" aria-modal="true" aria-label={label}>
      <button type="button" className="scrim" aria-label="Close" onClick={closeOverlay} />
      <div className={`overlay-panel ${kind}-panel`}>{children}</div>
    </div>
  );
}
