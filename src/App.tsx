import { Routes } from './routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@/components/docs/MDXContent';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <MDXProvider components={MDXComponents}>
        <LanguageProvider>
          <Routes />
        </LanguageProvider>
      </MDXProvider>
    </HelmetProvider>
  );
}

export default App;
