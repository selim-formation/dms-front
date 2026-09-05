/**
 * Login Route
 * Authentication route for tenant-specific login
 */

import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";
import { requireGuest } from "@/core/router";
import { GuestGuard } from "@/core/auth/guards/GuestGuard";

export const Route = createFileRoute("/_guest/login")({
  beforeLoad: async (ctx) => {
    await requireGuest(ctx.context);
  },
  component: LoginPageRoute,
});

function LoginPageRoute() {
  return (
    <GuestGuard>
      <LoginPage backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80" />
    </GuestGuard>
  );
}
