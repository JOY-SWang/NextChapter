import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { JOYAI_STRENGTHS, sameStrengths, type StrengthValues } from '../data/content';

export type OverlayId =
  | 'drawer'
  | 'meetJoyAI'
  | 'joyaiProfile'
  | 'planReady'
  | 'rsvp'
  | 'chatBooked'
  | 'trialClass'
  | 'editStrengths';

export type TextSize = 'standard' | 'large' | 'xl';

export interface Settings {
  textSize: TextSize;
  boldText: boolean;
  highContrast: boolean;
  readAloud: boolean;
}

interface AppState {
  overlay: OverlayId | null;
  openOverlay: (id: OverlayId) => void;
  closeOverlay: () => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  /** Events the user has added to My Day from Community / Explore / My Plan. */
  addedToMyDay: string[];
  addToMyDay: (key: string) => void;
  /** Sarah's strength levels (0–100) — JoyAI's assessment until she edits them. */
  strengths: StrengthValues;
  /** When Sarah last saved her own edits (null = still JoyAI's assessment). */
  strengthsEditedAt: number | null;
  saveStrengths: (values: StrengthValues) => void;
  /** Sarah tapped "Not now" on JoyAI's proactive check-in on Home (stays dismissed for the session). */
  joyaiCheckinDismissed: boolean;
  setJoyAICheckinDismissed: (v: boolean) => void;
}

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState<OverlayId | null>(null);
  const [settings, setSettings] = useState<Settings>({
    textSize: 'large',
    boldText: false,
    highContrast: false,
    readAloud: true,
  });
  const [addedToMyDay, setAdded] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<StrengthValues>(JOYAI_STRENGTHS);
  const [strengthsEditedAt, setEditedAt] = useState<number | null>(null);
  const [joyaiCheckinDismissed, setJoyAICheckinDismissed] = useState(false);

  const openOverlay = useCallback((id: OverlayId) => setOverlay(id), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const addToMyDay = useCallback((key: string) => setAdded((a) => (a.includes(key) ? a : [...a, key])), []);
  const saveStrengths = useCallback((values: StrengthValues) => {
    setStrengths(values);
    setEditedAt(sameStrengths(values, JOYAI_STRENGTHS) ? null : Date.now());
  }, []);

  const value = useMemo(
    () => ({ overlay, openOverlay, closeOverlay, settings, updateSettings, addedToMyDay, addToMyDay, strengths, strengthsEditedAt, saveStrengths, joyaiCheckinDismissed, setJoyAICheckinDismissed }),
    [overlay, openOverlay, closeOverlay, settings, updateSettings, addedToMyDay, addToMyDay, strengths, strengthsEditedAt, saveStrengths, joyaiCheckinDismissed],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
