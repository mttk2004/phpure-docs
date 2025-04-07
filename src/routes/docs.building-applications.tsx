import { createRoute } from '@tanstack/react-router';
import { Route as docsRoute } from './docs';
import BuildingApplications from '@/pages/docs/BuildingApplications';

export const Route = createRoute({
  getParentRoute: () => docsRoute,
  path: 'building-applications',
  component: BuildingApplications,
});
