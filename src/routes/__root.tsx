/**
 * Root Route
 * Base layout and context for all routes
 */

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { RouteContext } from "@/core/router/types";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />

      {/* Router Devtools in development */}
      {import.meta.env.DEV && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
    </>
  );
}
