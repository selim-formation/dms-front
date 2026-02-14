/**
 * App Component
 * Root application component with router setup
 */

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./core/auth/hooks/useAuth";
import { useTenant } from "./core/tenant/hooks/useTenant";
import { queryClient } from "./core/providers/AppProviders";
import "./App.css";

function App() {
  const auth = useAuth();
  const tenant = useTenant();

  return (
    <RouterProvider
      router={router}
      context={{
        auth,
        tenant,
        queryClient,
        location: {
          pathname: window.location.pathname,
          search: {},
        },
      }}
    />
  );
}

export default App;
