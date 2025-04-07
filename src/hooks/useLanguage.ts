import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export type Language = 'vi' | 'en';

export interface TranslationOptions {
  [key: string]: unknown;
}

export interface UseLanguageReturn {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isVietnamese: boolean;
  isEnglish: boolean;
  t: (key: string, options?: TranslationOptions) => string;
}

export function useLanguage(): UseLanguageReturn {
  const { i18n, t } = useTranslation();

  const language = i18n.language as Language || 'vi';
  const isVietnamese = language === 'vi';
  const isEnglish = language === 'en';

  const setLanguage = useCallback((lang: Language) => {
    i18n.changeLanguage(lang);

    // Lưu ngôn ngữ vào localStorage để giữ nguyên khi tải lại trang
    localStorage.setItem('language', lang);
  }, [i18n]);

  const toggleLanguage = useCallback(() => {
    const newLang = isVietnamese ? 'en' : 'vi';
    setLanguage(newLang as Language);
  }, [isVietnamese, setLanguage]);

  return {
    language,
    setLanguage,
    toggleLanguage,
    isVietnamese,
    isEnglish,
    t,
  };
}
