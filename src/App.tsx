import { Routes } from './routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import usePerformanceOptimizations from '@/hooks/usePerformanceOptimizations';
import ThemePreloader from './components/ui/ThemePreloader';

export default function App() {
  // Áp dụng các tối ưu hóa hiệu suất
  usePerformanceOptimizations();

  return (
    <LanguageProvider>
      {/* Thêm ThemePreloader để nạp trước các styles của theme và tránh flash */}
      <ThemePreloader />
      <Routes />
    </LanguageProvider>
  );
}
