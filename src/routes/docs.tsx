import { createRoute, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Outlet } from '@tanstack/react-router';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    // Nếu đường dẫn chính xác là /docs/ hoặc /docs, chuyển hướng về /docs/introduction
    if (location.pathname === '/docs/' || location.pathname === '/docs') {
      throw redirect({
        to: '/docs/introduction',
        replace: true
      });
    }
  }
});
