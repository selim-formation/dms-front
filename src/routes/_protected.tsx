/**
 * Protected Layout Route
 * Guards every nested route with a session check against the live
 * AuthProvider context (populated by App.tsx's RouterProvider context
 * prop) — not a separate query, so there's exactly one /api/me fetch.
 */

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ context, location }) => {
    if (!context.auth.isAuthenticated || !context.auth.user) {
      throw redirect({
        to: "/login",
        search: { redirect: location.pathname },
      });
    }
  },
  component: () => <Outlet />,
});
