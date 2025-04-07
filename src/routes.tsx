import { RouterProvider, createRouter } from '@tanstack/react-router';

// Import routes
import { Route as rootRoute } from './routes/__root';
import { Route as docsRoute } from './routes/docs';
import { Route as homeRoute } from './routes/index.home';
import { Route as introductionRoute } from './routes/docs.introduction';
import { Route as gettingStartedRoute } from './routes/docs.getting-started';
import { Route as coreConcpetsRoute } from './routes/docs.core-concepts';
import { Route as directoryStructureRoute } from './routes/docs.directory-structure';
import { Route as featuresRoute } from './routes/docs.features';
import { Route as buildingApplicationsRoute } from './routes/docs.building-applications';
import { Route as advancedTechniquesRoute } from './routes/docs.advanced-techniques';

// Đăng ký routes
const routeTree = rootRoute.addChildren([
  homeRoute,
  docsRoute.addChildren([
    introductionRoute,
    gettingStartedRoute,
    coreConcpetsRoute,
    directoryStructureRoute,
    featuresRoute,
    buildingApplicationsRoute,
    advancedTechniquesRoute,
  ]),
]);

// Tạo router với routeTree
const router = createRouter({ routeTree });

// Khai báo kiểu cho router
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Router component export
export function Routes() {
  return <RouterProvider router={router} />;
}
