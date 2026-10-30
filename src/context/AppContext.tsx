import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type OverlayId =
  | 'drawer'
  | 'meetJoyy'
  | 'joyyProfile'
  | 'planReady'
  | 'rsvp'
  | 'chatBooked'
  | 'trialClass';

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
  /** Events the user has added to My Day from Community / Discover / Roadmap. */
  addedToMyDay: string[];
  addToMyDay: (key: string) => void;
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

  const openOverlay = useCallback((id: OverlayId) => setOverlay(id), []);
  const closeOverlay = useCallback(() => setOverlay(null), []);
  const updateSettings = useCallback((patch: Partial<Settings>) => setSettings((s) => ({ ...s, ...patch })), []);
  const addToMyDay = useCallback((key: string) => setAdded((a) => (a.includes(key) ? a : [...a, key])), []);

  const value = useMemo(
    () => ({ overlay, openOverlay, closeOverlay, settings, updateSettings, addedToMyDay, addToMyDay }),
    [overlay, openOverlay, closeOverlay, settings, updateSettings, addedToMyDay, addToMyDay],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside <AppProvider>');
  return v;
}
