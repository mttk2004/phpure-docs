import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Outlet } from '@tanstack/react-router';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: () => <Outlet />,
});
