import { Outlet, createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './index';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: 'docs',
  component: () => <Outlet />,
});
