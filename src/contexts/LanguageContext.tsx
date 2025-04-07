import { createContext, useContext, useCallback, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isVietnamese: boolean;
  isEnglish: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

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
    setLanguage(newLang);
  }, [isVietnamese, setLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isVietnamese,
        isEnglish
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageProvider;
