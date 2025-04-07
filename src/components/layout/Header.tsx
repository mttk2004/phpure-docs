import { Link } from '@tanstack/react-router';
import { Menu, X, Moon, Sun, Github, Languages } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { GITHUB_REPO_URL, GITHUB_STAR_URL } from '@/utils';
interface HeaderProps {
  isSidebarOpen: boolean;
  onMenuClick: () => void;
}

export default function Header({ isSidebarOpen, onMenuClick }: HeaderProps) {
  const { toggleTheme, isDark } = useTheme();
  const { toggleLanguage, isVietnamese } = useLanguage();
  const [themeAnimating, setThemeAnimating] = useState(false);
  const [langAnimating, setLangAnimating] = useState(false);

  const handleThemeToggle = () => {
    setThemeAnimating(true);
    toggleTheme();
    setTimeout(() => setThemeAnimating(false), 300);
  };

  const handleLanguageToggle = () => {
    setLangAnimating(true);
    toggleLanguage();
    setTimeout(() => setLangAnimating(false), 300);
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
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            </div>
            <span className="text-gradient-primary">PHPure</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-4 mr-4">
            <Link
              to="/docs"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              activeProps={{ className: "text-primary font-medium" }}
            >
              Tài liệu
            </Link>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
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
            <span className="sr-only">Chuyển đổi ngôn ngữ</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className={`rounded-full overflow-hidden transition-all cursor-pointer ${themeAnimating ? 'scale-90' : 'scale-100'}`}
            title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
          >
            <Sun
              className={`h-4 w-4 transition-transform duration-300 ${isDark ? 'rotate-0 scale-100' : 'rotate-90 scale-0'}`}
            />
            <Moon
              className={`absolute h-4 w-4 transition-transform duration-300 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}
            />
            <span className="sr-only">Chuyển đổi giao diện</span>
          </Button>

          <a
            href={GITHUB_STAR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex"
          >
            <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
              <Github size={16} />
              <span>Star on GitHub</span>
            </Button>
          </a>
        </div>
      </div>
    </header>
  );
}
