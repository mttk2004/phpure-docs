import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

// Tạo một đối tượng event để thông báo khi theme thay đổi
const themeChangeEvent = new Event('themeChange');

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark');

  // Hàm để lấy theme hiện tại
  const getTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    return savedTheme || systemTheme;
  };

  // Hàm để áp dụng theme
  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    setTheme(newTheme);
  };

  useEffect(() => {
    // Áp dụng theme khi component mount
    const currentTheme = getTheme();
    applyTheme(currentTheme);

    // Lắng nghe sự kiện thay đổi theme
    const handleThemeChange = () => {
      const updatedTheme = getTheme();
      applyTheme(updatedTheme);
    };

    // Lắng nghe sự kiện thay đổi trong localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'theme') {
        handleThemeChange();
      }
    });

    // Lắng nghe sự kiện thay đổi theme từ bên trong ứng dụng
    window.addEventListener('themeChange', handleThemeChange);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleThemeChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    // Phát ra sự kiện thay đổi theme
    window.dispatchEvent(themeChangeEvent);
  };

  return { theme, toggleTheme };
}
