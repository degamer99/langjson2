import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState, Theme, FontSize, ScriptFont } from '../types';

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'base',
      showWordByWord: true,
      translationLanguage: 'English',
      scriptFont: 'uthmani',
      isRtl: true,
      
      setTheme: (theme: Theme) => set({ theme }),
      // FIX: Correctly update fontSize using the 'size' parameter. The shorthand property was incorrect.
      setFontSize: (size: FontSize) => set({ fontSize: size }),
      toggleWordByWord: () => set((state) => ({ showWordByWord: !state.showWordByWord })),
      setTranslationLanguage: (lang: string) => set({ translationLanguage: lang }),
      setScriptFont: (font: ScriptFont) => set({ scriptFont: font }),
      toggleRtl: () => set((state) => ({ isRtl: !state.isRtl })),
    }),
    {
      name: 'langjson-settings-storage', // name of the item in the storage (must be unique)
    }
  )
);