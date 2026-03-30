/**
 * Login Route
 * Authentication route for tenant-specific login
 */

import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth";

export const Route = createFileRoute("/_guest/login")({
  component: LoginPageRoute,
});

function LoginPageRoute() {
  return (
    <LoginPage
      backgroundImage="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&q=80"
    />
  );
}
