import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 px-3 py-1 rounded-md bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
      aria-label={language === 'vi' ? 'Switch to English' : 'Chuyển sang tiếng Việt'}
    >
      <span className="font-medium text-sm">
        {language === 'vi' ? 'EN' : 'VI'}
      </span>
    </button>
  );
}
