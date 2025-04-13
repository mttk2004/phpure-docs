import { Link } from '@tanstack/react-router';
import { Menu, X, Moon, Sun, Github, Languages } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';
import { GITHUB_RELEASES_URL, GITHUB_STAR_URL } from '@/utils';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}

export default function Header({ isSidebarOpen, onMenuClick }: HeaderProps) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { toggleLanguage, isVietnamese } = useLanguage();
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [langAnimating, setLangAnimating] = useState(false);
  const savedScrollPosition = useRef<number | null>(null);
  const isLanguageChanging = useRef<boolean>(false);

  // Lắng nghe sự kiện content-rendered để khôi phục vị trí cuộn sau khi nội dung đã tải xong
  useEffect(() => {
    const handleContentRendered = () => {
      if (isLanguageChanging.current && savedScrollPosition.current !== null) {
        console.log('Content rendered, restoring scroll position to:', savedScrollPosition.current);
        window.scrollTo({
          top: savedScrollPosition.current,
          behavior: 'instant'
        });
        savedScrollPosition.current = null;
        isLanguageChanging.current = false;
        setLangAnimating(false);
      }
    };

    window.addEventListener('content-rendered', handleContentRendered);

    return () => {
      window.removeEventListener('content-rendered', handleContentRendered);
    };
  }, []);

  const handleThemeToggle = () => {
    setThemeAnimating(true);
    toggleTheme();
    setTimeout(() => setThemeAnimating(false), 300);
  };

  const handleLanguageToggle = () => {
    // Lưu lại vị trí cuộn hiện tại trước khi chuyển ngôn ngữ
    savedScrollPosition.current = window.scrollY;
    isLanguageChanging.current = true;

    setLangAnimating(true);
    toggleLanguage();

    // Đặt một timeout dự phòng để xử lý trường hợp sự kiện content-rendered không được kích hoạt
    setTimeout(() => {
      if (isLanguageChanging.current && savedScrollPosition.current !== null) {
        console.log('Fallback: restoring scroll position after timeout');
        window.scrollTo({
          top: savedScrollPosition.current,
          behavior: 'instant'
        });
        savedScrollPosition.current = null;
        isLanguageChanging.current = false;
        setLangAnimating(false);
      }
    }, 2000); // Tăng thời gian chờ lên 2 giây để đảm bảo nội dung đã được tải
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container h-full px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={onMenuClick}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl"
          >
            <span className="text-primary font-bold">PHPure</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-6 mr-4 font-medium">
            <Link
              to="/docs"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
              activeProps={{ className: "text-primary font-medium" }}
            >
              {t('navigation.documentation')}
            </Link>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('navigation.releases')}
            </a>
            <a
              href="/contribute"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('navigation.contribute')}
            </a>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLanguageToggle}
            className={`rounded-full overflow-hidden transition-all cursor-pointer ${langAnimating ? 'scale-90' : 'scale-100'}`}
            title={isVietnamese ? "Switch to English" : "Chuyển sang tiếng Việt"}
          >
            <Languages
              className={`h-4 w-4 transition-all ${langAnimating ? 'rotate-180' : 'rotate-0'}`}
            />
            <span className="sr-only">{t('navigation.toggleLanguage')}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className={`rounded-full overflow-hidden transition-all cursor-pointer ${themeAnimating ? 'scale-90' : 'scale-100'}`}
            title={theme === 'dark' ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          >
            <Sun
              className={`h-4 w-4 transition-transform duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
            />
            <Moon
              className={`absolute h-4 w-4 transition-transform duration-300 ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
            />
            <span className="sr-only">{t('navigation.toggleTheme')}</span>
          </Button>

          <a
            href={GITHUB_STAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex"
          >
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
              <Github size={16} />
              <span className="font-medium">{t('navigation.starOnGitHub')}</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
