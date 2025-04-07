import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import CoreConcepts from '@/pages/docs/CoreConcepts';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'core-concepts',
  component: CoreConcepts,
});
