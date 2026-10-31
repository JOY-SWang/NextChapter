import { useId } from 'react';

export type JoyyMood = 'smile' | 'wink' | 'heart';

/**
 * Joyy — the Next Chapter AI Coach mascot (vector, mirrors Figma "NC / Joyy").
 * `animated` splits the drawing into parts (body, right leaf, eyes, shadow) that the
 * welcome animation can move; the resting pose is identical to the static one.
 */
export function Joyy({ mood = 'smile', size = 120, className, animated = false }: { mood?: JoyyMood; size?: number; className?: string; animated?: boolean }) {
  const id = useId().replace(/:/g, '');
  const body = `jb-${id}`;
  const leaf = `jl-${id}`;
  const ink = '#1E382B';
  const a = (cls: string) => (animated ? cls : undefined);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={`${className ?? ''} ${animated ? 'joyy-animated' : ''}`} role="img" aria-label="Joyy, your AI coach">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D6F0DF" />
          <stop offset="1" stopColor="#8CC9A5" />
        </linearGradient>
        <linearGradient id={leaf} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FD19F" />
          <stop offset="1" stopColor="#4E9A68" />
        </linearGradient>
      </defs>
      <ellipse className={a('joyy-shadow')} cx="60" cy="109" rx="34" ry="5" fill={ink} fillOpacity="0.12" />
      <g className={a('joyy-figure')}>
        <path d="M60 42C60 34 61 28 64 22" stroke="#3D7A52" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        <path d="M61 31C52 18 38 15 28 21C34 33 49 37 61 31Z" fill={`url(#${leaf})`} />
        <path d="M58 30C50 25 42 22 34 22" stroke="#C9EBD2" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <g className={a('joyy-leaf-right')}>
          <path d="M63 26C68 11 82 5 96 9C92 24 77 31 63 26Z" fill={`url(#${leaf})`} />
          <path d="M66 25C73 18 81 13 90 11" stroke="#C9EBD2" strokeOpacity="0.8" strokeWidth="1.6" strokeLinecap="round" fill="none" />
        </g>
        <g className={a('joyy-breathe')}>
          <path d="M60 40C86 40 101 58 101 79C101 99 85 107 60 107C35 107 19 99 19 79C19 58 34 40 60 40Z" fill={`url(#${body})`} />
          <path d="M38 56C44 49 51 46 58 45" stroke="#fff" strokeOpacity="0.55" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="38" cy="85" rx="6" ry="3.6" fill="#E8998B" fillOpacity="0.7" />
          <ellipse cx="82" cy="85" rx="6" ry="3.6" fill="#E8998B" fillOpacity="0.7" />
          {mood === 'wink' ? (
            <>
              <g className={a('joyy-eye-left')}>
                <ellipse cx="47" cy="73" rx="4" ry="5" fill={ink} />
                <circle cx="48.4" cy="71.2" r="1.3" fill="#fff" />
              </g>
              {animated && (
                // Right eye starts open, then closes into the wink.
                <g className="joyy-eye-right-open">
                  <ellipse cx="73.5" cy="73" rx="4" ry="5" fill={ink} />
                  <circle cx="74.9" cy="71.2" r="1.3" fill="#fff" />
                </g>
              )}
              <path className={a('joyy-eye-wink')} d="M68 74Q73.5 69 79 74" stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M41 75Q46.5 68 52 75" stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M68 75Q73.5 68 79 75" stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            </>
          )}
          {mood === 'heart' ? (
            <>
              <path d="M53 83Q60 89 67 83" stroke={ink} strokeWidth="3" strokeLinecap="round" fill="none" />
              <path
                d="M60 108.5C50.6 102.7 47 98.4 47 94.1C47 90.5 49.9 88.3 52.8 88.3C55.7 88.3 57.8 89.7 60 92.6C62.2 89.7 64.3 88.3 67.2 88.3C70.1 88.3 73 90.5 73 94.1C73 98.4 69.4 102.7 60 108.5Z"
                fill="#995A4E"
              />
              <path d="M51.6 92.1C52.3 90.7 53.8 90.3 55.2 90.7" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <path d="M51 85Q60 94 69 85" stroke={ink} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          )}
        </g>
      </g>
    </svg>
  );
}

/** Circular avatar version used in chat bubbles, notes and the drawer. */
export function JoyyAvatar({ size = 40, onClick, label = 'Open Joyy’s profile' }: { size?: number; onClick?: () => void; label?: string }) {
  const inner = (
    <span className="joyy-avatar" style={{ width: size, height: size }}>
      <Joyy size={size * 0.9} />
    </span>
  );
  if (!onClick) return inner;
  return (
    <button type="button" className="unstyled" onClick={onClick} aria-label={label}>
      {inner}
    </button>
  );
}

/** Four-point sparkle used around Joyy illustrations. */
export function Sparkle({ size = 12, color = 'var(--secondary-key)', style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} aria-hidden>
      <path d="M12 2C12.8 8 16 11.2 22 12C16 12.8 12.8 16 12 22C11.2 16 8 12.8 2 12C8 11.2 11.2 8 12 2Z" fill={color} />
    </svg>
  );
}
