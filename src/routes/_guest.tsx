/**
 * Guest Layout Route
 * Keeps guest-only pages (login, register) unreachable once a session
 * exists — checked against the live AuthProvider context, same as
 * requireAuth on the protected side.
 */

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { requireGuest } from "@/core/router";

export const Route = createFileRoute("/_guest")({
  beforeLoad: async (ctx) => {
    await requireGuest(ctx.context);
  },
  component: () => <Outlet />,
});
