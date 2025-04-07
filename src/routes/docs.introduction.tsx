import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import Introduction from '@/pages/docs/Introduction';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'introduction',
  component: Introduction,
});
