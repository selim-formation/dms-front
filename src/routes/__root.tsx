/**
 * Root Route
 * Base layout and context for all routes
 */

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { RouteContext } from "@/core/router/types";
export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
