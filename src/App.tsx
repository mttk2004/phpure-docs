import { Routes } from './routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';

function App() {
  // Sử dụng hook tối ưu hóa hiệu suất
  usePerformanceOptimizations();

  return (
    <LanguageProvider>
      <Routes />
    </LanguageProvider>
  );
}

export default App;
