import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslations from './en.json';
import viTranslations from './vi.json';

// Lấy ngôn ngữ đã lưu trong localStorage hoặc dùng ngôn ngữ mặc định là tiếng Việt
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    vi: { translation: viTranslations }
  },
  lng: savedLanguage || 'vi', // Sử dụng ngôn ngữ đã lưu hoặc mặc định là tiếng Việt
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // Không escape các giá trị HTML
  }
});

export default i18n;
