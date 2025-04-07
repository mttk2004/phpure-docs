import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import GettingStarted from '@/pages/docs/GettingStarted';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'getting-started',
  component: GettingStarted,
});
