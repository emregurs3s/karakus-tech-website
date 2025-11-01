import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

interface LanguageStore {
  language: string;
  setLanguage: (lang: string) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'tr',
      
      setLanguage: (lang: string) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },
      
      toggleLanguage: () => {
        const currentLang = get().language;
        const newLang = currentLang === 'tr' ? 'en' : 'tr';
        get().setLanguage(newLang);
      }
    }),
    {
      name: 'language-storage'
    }
  )
);