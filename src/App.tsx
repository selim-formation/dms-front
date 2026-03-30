/**
 * App Component
 * Root application component with router setup
 */

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";
import { useAuth } from "./core/auth/hooks/useAuth";
import { useTenant } from "./core/tenant/hooks/useTenant";
import "./App.css";
import { apiClient } from "./core/api/client";
import { useEffect } from "react";

function App() {
  const auth = useAuth();
  const tenant = useTenant();

  useEffect(() => {
    apiClient.initializeCsrf();
  }, []);

  return (
    <RouterProvider
      router={router}
      context={{
        queryClient: router.options.context.queryClient,
        auth,
        tenant,
      }}
    />
  );
}

export default App;
