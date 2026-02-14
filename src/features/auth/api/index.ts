/**
 * Auth Feature - Login API Hooks
 * React Query hooks for login operations
 */

import { useMutation } from "@tanstack/react-query";
import { login } from "@/core/auth/services/auth.service";
import { type LoginCredentials } from "@/core/auth/types";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("Login API");

/**
 * Hook for login mutation
 */
export function useLoginMutation() {
  return useMutation({
    mutationFn: async (data: {
      tenantId: string;
      credentials: LoginCredentials;
    }) => {
      log.debug("Login mutation starting", { email: data.credentials.email });
      return login(data.tenantId, data.credentials);
    },
    onError: (error) => {
      log.error("Login mutation failed", { error });
    },
    onSuccess: () => {
      log.info("Login mutation successful");
    },
  });
}
