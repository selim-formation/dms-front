/**
 * Tenant Provider
 * Manages tenant state and validation
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TenantContext } from "./TenantContext";
import {
  validateTenant,
  tenantValidateQueryKey,
  TENANT_VALIDATE_STALE_TIME,
} from "../services/tenant.service";
import {
  getTenantCookie,
  setTenantCookie,
} from "../services/tenant-cookie.service";
import { apiClient } from "@/core/api/client";
import { logger } from "@/shared/utils/logger";

const log = logger.createScoped("TenantProvider");

interface TenantProviderProps {
  children: React.ReactNode;
  initialTenantId?: string | null;
}

/**
 * Tenant Provider Component
 * Validates tenant and provides context to children
 */
export function TenantProvider({
  children,
  initialTenantId = null,
}: TenantProviderProps) {
  const queryClient = useQueryClient();
  // Fall back to the last cached tenant (set on login, cleared on
  // logout) when nothing more specific — e.g. the /$tenant URL param —
  // has provided one yet.
  const [tenantId, setTenantId] = useState<string | null>(
    () => initialTenantId ?? getTenantCookie(),
  );
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Validate tenant. Goes through the shared react-query cache (same
   * key the /$tenant router layout uses) so if that guard already
   * validated this tenant within TENANT_VALIDATE_STALE_TIME, this is
   * a cache hit — not a second network call.
   */
  const loadTenant = useCallback(
    async (id: string) => {
      setIsValidating(true);
      setError(null);

      try {
        log.debug(`Loading tenant: ${id}`);

        const validation = await queryClient.fetchQuery({
          queryKey: tenantValidateQueryKey(id),
          queryFn: () => validateTenant(id),
          staleTime: TENANT_VALIDATE_STALE_TIME,
        });

        if (validation.kind === "valid") {
          setIsValid(true);
          apiClient.setTenant(id);
          setTenantCookie(id);
          log.info(`Tenant loaded successfully: ${id}`);
        } else {
          setIsValid(false);
          setError(new Error(validation.message || "Tenant validation failed"));
          log.warn(`Tenant validation failed: ${id}`, { data: { kind: validation.kind } });
        }
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to load tenant");
        setError(error);
        setIsValid(false);

        log.error(`Error loading tenant: ${id}`, { data: error });
      } finally {
        setIsValidating(false);
      }
    },
    [queryClient],
  );

  /**
   * Effect to load tenant when tenantId changes
   */
  useEffect(() => {
    if (tenantId) {
      loadTenant(tenantId);
    } else {
      // Clear tenant state
      setIsValid(false);
      setError(null);
      apiClient.setTenant(null);
    }
  }, [tenantId, loadTenant]);

  /**
   * Refetch tenant data
   */
  const refetch = useCallback(async () => {
    if (tenantId) {
      await queryClient.invalidateQueries({ queryKey: tenantValidateQueryKey(tenantId) });
      await loadTenant(tenantId);
    }
  }, [tenantId, loadTenant, queryClient]);

  /**
   * Memoized context value
   */
  const contextValue = useMemo(
    () => ({
      tenantId,
      // The validate endpoint doesn't return tenant details, only
      // exists/access booleans — nothing to hydrate a full Tenant with.
      tenant: null,
      current: null,
      isValidating,
      isValid,
      error,
      setTenantId,
      refetch,
    }),
    [tenantId, isValidating, isValid, error, refetch],
  );

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}
