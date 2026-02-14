/**
 * TanStack Router Configuration
 * Creates and exports the configured router instance
 */

import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { queryClient } from "./core/providers/AppProviders";
import type { RouteContext } from "./core/router/types";

/**
 * Create router with context
 */
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // Auth and tenant will be provided by providers
  } as RouteContext,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({ error }) => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  ),
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export type Router = typeof router;
