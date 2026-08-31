/**
 * App Component
 * Root application component with router setup
 */

import { useMemo } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./core/auth/hooks/useAuth";
import { useTenant } from "./core/tenant/hooks/useTenant";
import { queryClient } from "./core/providers/AppProviders";
import "./App.css";

function App() {
  const auth = useAuth();
  const tenant = useTenant();

  // auth/tenant are already memoized by their own providers, so this
  // only recomputes — and only then re-evaluates route guards that
  // depend on router context — when auth or tenant actually changed.
  const context = useMemo(
    () => ({
      auth,
      tenant,
      queryClient,
      location: {
        pathname: window.location.pathname,
        search: {},
      },
    }),
    [auth, tenant],
  );

  return <RouterProvider router={router} context={context} />;
}

export default App;
