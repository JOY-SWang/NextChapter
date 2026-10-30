import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';

/**
 * Image slot backed by /public/images/<name>.jpg (downloaded from Figma with
 * `npm run fetch:assets`). Until the file exists it renders a soft, on-palette
 * placeholder so the layout still reads correctly.
 */
export type PhotoName =
  | 'hero-welcome'
  | 'sarah'
  | 'elena'
  | 'peer-1'
  | 'peer-2'
  | 'peer-3'
  | 'path-yoga'
  | 'path-mentor'
  | 'path-facilitator'
  | 'class-beginner'
  | 'course-ytt'
  | 'studio-helper'
  | 'connect-instructors'
  | 'yoga-space'
  | 'reflection';

const FALLBACK: Record<PhotoName, { initials?: string; icon?: string; tint: string }> = {
  'hero-welcome': { icon: 'journal', tint: 'linear-gradient(135deg,#e9dcc9,#cbead7)' },
  sarah: { initials: 'SJ', tint: 'linear-gradient(135deg,#ffddba,#e8c4a6)' },
  elena: { initials: 'ER', tint: 'linear-gradient(135deg,#e7e9e4,#c2c8c2)' },
  'peer-1': { initials: 'MT', tint: 'linear-gradient(135deg,#ffdad4,#e8998b)' },
  'peer-2': { initials: 'DL', tint: 'linear-gradient(135deg,#cbead7,#85a291)' },
  'peer-3': { initials: 'AK', tint: 'linear-gradient(135deg,#ffddba,#d9933b)' },
  'path-yoga': { icon: 'lotus', tint: 'linear-gradient(135deg,#f0e4d3,#cbead7)' },
  'path-mentor': { icon: 'coffee', tint: 'linear-gradient(135deg,#e7e9e4,#d5c6b2)' },
  'path-facilitator': { icon: 'people', tint: 'linear-gradient(135deg,#ffddba,#ffdad4)' },
  'class-beginner': { icon: 'lotus', tint: 'linear-gradient(135deg,#d9c6a6,#8c7a5e)' },
  'course-ytt': { icon: 'book', tint: 'linear-gradient(135deg,#d9d2c3,#8f8572)' },
  'studio-helper': { icon: 'coffee', tint: 'linear-gradient(135deg,#c9c1b0,#7b7466)' },
  'connect-instructors': { icon: 'people', tint: 'linear-gradient(135deg,#d6cdbf,#857a6b)' },
  'yoga-space': { icon: 'lotus', tint: 'linear-gradient(135deg,#efe6d6,#cbead7)' },
  reflection: { icon: 'journal', tint: 'linear-gradient(135deg,#efe6d6,#ffddba)' },
};

interface Props {
  name: PhotoName;
  alt: string;
  className?: string;
  style?: CSSProperties;
  round?: boolean;
}

export function Photo({ name, alt, className, style, round }: Props) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}images/${name}.jpg`;
  const fb = FALLBACK[name];
  const cls = ['photo', round ? 'photo-round' : '', className ?? ''].join(' ');
  if (failed) {
    return (
      <div className={`${cls} photo-fallback`} style={{ background: fb.tint, ...style }} role="img" aria-label={alt}>
        {fb.initials ? <span className="photo-initials">{fb.initials}</span> : <Icon name={fb.icon ?? 'smile'} size={28} color="rgba(30,56,43,.55)" />}
      </div>
    );
  }
  return <img className={cls} style={style} src={src} alt={alt} onError={() => setFailed(true)} loading="lazy" />;
}
