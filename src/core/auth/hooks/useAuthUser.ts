import { useQuery } from "@tanstack/react-query";
import * as authService from "../services/auth.service";

/**
 * Bootstraps the session from GET /api/me. Tenant-agnostic — runs on
 * app load regardless of which (if any) tenant is currently selected.
 */
export function useAuthUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.getMe,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
