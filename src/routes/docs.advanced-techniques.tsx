import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import AdvancedTechniques from '@/pages/docs/AdvancedTechniques';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'advanced-techniques',
  component: AdvancedTechniques,
});
