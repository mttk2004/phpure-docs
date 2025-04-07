/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DocsImport } from './routes/docs'
import { Route as IndexHomeImport } from './routes/index.home'
import { Route as DocsIntroductionImport } from './routes/docs.introduction'
import { Route as DocsGettingStartedImport } from './routes/docs.getting-started'
import { Route as DocsFeaturesImport } from './routes/docs.features'
import { Route as DocsDirectoryStructureImport } from './routes/docs.directory-structure'
import { Route as DocsCoreConceptsImport } from './routes/docs.core-concepts'
import { Route as DocsBuildingApplicationsImport } from './routes/docs.building-applications'
import { Route as DocsAdvancedTechniquesImport } from './routes/docs.advanced-techniques'

// Create/Update Routes

const DocsRoute = DocsImport.update({
  id: '/docs',
  path: '/docs',
  getParentRoute: () => rootRoute,
} as any)

const IndexHomeRoute = IndexHomeImport.update({
  id: '/index/home',
  path: '/index/home',
  getParentRoute: () => rootRoute,
} as any)

const DocsIntroductionRoute = DocsIntroductionImport.update({
  id: '/introduction',
  path: '/introduction',
  getParentRoute: () => DocsRoute,
} as any)

const DocsGettingStartedRoute = DocsGettingStartedImport.update({
  id: '/getting-started',
  path: '/getting-started',
  getParentRoute: () => DocsRoute,
} as any)

const DocsFeaturesRoute = DocsFeaturesImport.update({
  id: '/features',
  path: '/features',
  getParentRoute: () => DocsRoute,
} as any)

const DocsDirectoryStructureRoute = DocsDirectoryStructureImport.update({
  id: '/directory-structure',
  path: '/directory-structure',
  getParentRoute: () => DocsRoute,
} as any)

const DocsCoreConceptsRoute = DocsCoreConceptsImport.update({
  id: '/core-concepts',
  path: '/core-concepts',
  getParentRoute: () => DocsRoute,
} as any)

const DocsBuildingApplicationsRoute = DocsBuildingApplicationsImport.update({
  id: '/building-applications',
  path: '/building-applications',
  getParentRoute: () => DocsRoute,
} as any)

const DocsAdvancedTechniquesRoute = DocsAdvancedTechniquesImport.update({
  id: '/advanced-techniques',
  path: '/advanced-techniques',
  getParentRoute: () => DocsRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/docs': {
      id: '/docs'
      path: '/docs'
      fullPath: '/docs'
      preLoaderRoute: typeof DocsImport
      parentRoute: typeof rootRoute
    }
    '/docs/advanced-techniques': {
      id: '/docs/advanced-techniques'
      path: '/advanced-techniques'
      fullPath: '/docs/advanced-techniques'
      preLoaderRoute: typeof DocsAdvancedTechniquesImport
      parentRoute: typeof DocsImport
    }
    '/docs/building-applications': {
      id: '/docs/building-applications'
      path: '/building-applications'
      fullPath: '/docs/building-applications'
      preLoaderRoute: typeof DocsBuildingApplicationsImport
      parentRoute: typeof DocsImport
    }
    '/docs/core-concepts': {
      id: '/docs/core-concepts'
      path: '/core-concepts'
      fullPath: '/docs/core-concepts'
      preLoaderRoute: typeof DocsCoreConceptsImport
      parentRoute: typeof DocsImport
    }
    '/docs/directory-structure': {
      id: '/docs/directory-structure'
      path: '/directory-structure'
      fullPath: '/docs/directory-structure'
      preLoaderRoute: typeof DocsDirectoryStructureImport
      parentRoute: typeof DocsImport
    }
    '/docs/features': {
      id: '/docs/features'
      path: '/features'
      fullPath: '/docs/features'
      preLoaderRoute: typeof DocsFeaturesImport
      parentRoute: typeof DocsImport
    }
    '/docs/getting-started': {
      id: '/docs/getting-started'
      path: '/getting-started'
      fullPath: '/docs/getting-started'
      preLoaderRoute: typeof DocsGettingStartedImport
      parentRoute: typeof DocsImport
    }
    '/docs/introduction': {
      id: '/docs/introduction'
      path: '/introduction'
      fullPath: '/docs/introduction'
      preLoaderRoute: typeof DocsIntroductionImport
      parentRoute: typeof DocsImport
    }
    '/index/home': {
      id: '/index/home'
      path: '/index/home'
      fullPath: '/index/home'
      preLoaderRoute: typeof IndexHomeImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

interface DocsRouteChildren {
  DocsAdvancedTechniquesRoute: typeof DocsAdvancedTechniquesRoute
  DocsBuildingApplicationsRoute: typeof DocsBuildingApplicationsRoute
  DocsCoreConceptsRoute: typeof DocsCoreConceptsRoute
  DocsDirectoryStructureRoute: typeof DocsDirectoryStructureRoute
  DocsFeaturesRoute: typeof DocsFeaturesRoute
  DocsGettingStartedRoute: typeof DocsGettingStartedRoute
  DocsIntroductionRoute: typeof DocsIntroductionRoute
}

const DocsRouteChildren: DocsRouteChildren = {
  DocsAdvancedTechniquesRoute: DocsAdvancedTechniquesRoute,
  DocsBuildingApplicationsRoute: DocsBuildingApplicationsRoute,
  DocsCoreConceptsRoute: DocsCoreConceptsRoute,
  DocsDirectoryStructureRoute: DocsDirectoryStructureRoute,
  DocsFeaturesRoute: DocsFeaturesRoute,
  DocsGettingStartedRoute: DocsGettingStartedRoute,
  DocsIntroductionRoute: DocsIntroductionRoute,
}

const DocsRouteWithChildren = DocsRoute._addFileChildren(DocsRouteChildren)

export interface FileRoutesByFullPath {
  '/docs': typeof DocsRouteWithChildren
  '/docs/advanced-techniques': typeof DocsAdvancedTechniquesRoute
  '/docs/building-applications': typeof DocsBuildingApplicationsRoute
  '/docs/core-concepts': typeof DocsCoreConceptsRoute
  '/docs/directory-structure': typeof DocsDirectoryStructureRoute
  '/docs/features': typeof DocsFeaturesRoute
  '/docs/getting-started': typeof DocsGettingStartedRoute
  '/docs/introduction': typeof DocsIntroductionRoute
  '/index/home': typeof IndexHomeRoute
}

export interface FileRoutesByTo {
  '/docs': typeof DocsRouteWithChildren
  '/docs/advanced-techniques': typeof DocsAdvancedTechniquesRoute
  '/docs/building-applications': typeof DocsBuildingApplicationsRoute
  '/docs/core-concepts': typeof DocsCoreConceptsRoute
  '/docs/directory-structure': typeof DocsDirectoryStructureRoute
  '/docs/features': typeof DocsFeaturesRoute
  '/docs/getting-started': typeof DocsGettingStartedRoute
  '/docs/introduction': typeof DocsIntroductionRoute
  '/index/home': typeof IndexHomeRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/docs': typeof DocsRouteWithChildren
  '/docs/advanced-techniques': typeof DocsAdvancedTechniquesRoute
  '/docs/building-applications': typeof DocsBuildingApplicationsRoute
  '/docs/core-concepts': typeof DocsCoreConceptsRoute
  '/docs/directory-structure': typeof DocsDirectoryStructureRoute
  '/docs/features': typeof DocsFeaturesRoute
  '/docs/getting-started': typeof DocsGettingStartedRoute
  '/docs/introduction': typeof DocsIntroductionRoute
  '/index/home': typeof IndexHomeRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/docs'
    | '/docs/advanced-techniques'
    | '/docs/building-applications'
    | '/docs/core-concepts'
    | '/docs/directory-structure'
    | '/docs/features'
    | '/docs/getting-started'
    | '/docs/introduction'
    | '/index/home'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/docs'
    | '/docs/advanced-techniques'
    | '/docs/building-applications'
    | '/docs/core-concepts'
    | '/docs/directory-structure'
    | '/docs/features'
    | '/docs/getting-started'
    | '/docs/introduction'
    | '/index/home'
  id:
    | '__root__'
    | '/docs'
    | '/docs/advanced-techniques'
    | '/docs/building-applications'
    | '/docs/core-concepts'
    | '/docs/directory-structure'
    | '/docs/features'
    | '/docs/getting-started'
    | '/docs/introduction'
    | '/index/home'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  DocsRoute: typeof DocsRouteWithChildren
  IndexHomeRoute: typeof IndexHomeRoute
}

const rootRouteChildren: RootRouteChildren = {
  DocsRoute: DocsRouteWithChildren,
  IndexHomeRoute: IndexHomeRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/docs",
        "/index/home"
      ]
    },
    "/docs": {
      "filePath": "docs.tsx",
      "children": [
        "/docs/advanced-techniques",
        "/docs/building-applications",
        "/docs/core-concepts",
        "/docs/directory-structure",
        "/docs/features",
        "/docs/getting-started",
        "/docs/introduction"
      ]
    },
    "/docs/advanced-techniques": {
      "filePath": "docs.advanced-techniques.tsx",
      "parent": "/docs"
    },
    "/docs/building-applications": {
      "filePath": "docs.building-applications.tsx",
      "parent": "/docs"
    },
    "/docs/core-concepts": {
      "filePath": "docs.core-concepts.tsx",
      "parent": "/docs"
    },
    "/docs/directory-structure": {
      "filePath": "docs.directory-structure.tsx",
      "parent": "/docs"
    },
    "/docs/features": {
      "filePath": "docs.features.tsx",
      "parent": "/docs"
    },
    "/docs/getting-started": {
      "filePath": "docs.getting-started.tsx",
      "parent": "/docs"
    },
    "/docs/introduction": {
      "filePath": "docs.introduction.tsx",
      "parent": "/docs"
    },
    "/index/home": {
      "filePath": "index.home.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
