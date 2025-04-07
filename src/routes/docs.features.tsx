import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import Features from '@/pages/docs/Features';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'features',
  component: Features,
});
