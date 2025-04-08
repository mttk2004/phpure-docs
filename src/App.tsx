import { Routes } from './routes';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MDXProvider } from '@mdx-js/react';
import { MDXComponents } from '@/components/docs/MDXContent';

function App() {
  return (
    <MDXProvider components={MDXComponents}>
      <LanguageProvider>
        <Routes />
      </LanguageProvider>
    </MDXProvider>
  );
}

export default App;
