import React from 'react';
import { Routes } from './routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@/components/docs/MDXContent';
import { usePerformanceOptimizations } from '@/hooks/usePerformanceOptimizations';

function App() {
  // Sử dụng hook tối ưu hóa hiệu suất
  usePerformanceOptimizations();

  return (
    <MDXProvider components={MDXComponents}>
      <LanguageProvider>
        <Routes />
      </LanguageProvider>
    </MDXProvider>
  );
}

export default App;
