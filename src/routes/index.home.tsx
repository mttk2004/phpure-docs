import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './index';
import HomePage from '@/components/home/HomePage';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});
