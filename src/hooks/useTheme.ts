import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

export interface UseThemeReturn {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Lấy theme từ localStorage nếu có
    const savedTheme = localStorage.getItem('theme') as Theme;

    // Kiểm tra cài đặt theme của hệ thống nếu không có trong localStorage
    if (!savedTheme) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return savedTheme;
  });

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  // Cập nhật theme trong localStorage và DOM
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(isDark ? 'light' : 'dark');
  }, [isDark, setTheme]);

  // Cập nhật DOM khi theme thay đổi
  useEffect(() => {
    const root = window.document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [isDark]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
    isLight,
  };
}
