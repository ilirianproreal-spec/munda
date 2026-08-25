import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '../lib/translations';

interface SettingsState {
  soundOn: boolean;
  lang: Lang;
  toggleSound: () => void;
  setLang: (l: Lang) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundOn: true,
      lang: 'en',
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),
      setLang: (l) => set({ lang: l }),
    }),
    { name: 'munda-settings-v1' },
  ),
);
