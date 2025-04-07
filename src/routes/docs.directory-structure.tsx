import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import DirectoryStructure from '@/pages/docs/DirectoryStructure';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'directory-structure',
  component: DirectoryStructure,
});
