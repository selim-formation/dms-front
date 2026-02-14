/**
 * Tenant Provider
 * Manages tenant state and validation
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TenantContext } from "./TenantContext";
import { Tenant } from "../types";
import { validateTenant } from "../services/tenant.service";
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
  const [tenantId, setTenantId] = useState<string | null>(initialTenantId);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Validate and load tenant
   */
  const loadTenant = useCallback(async (id: string) => {
    setIsValidating(true);
    setError(null);

    try {
      log.debug(`Loading tenant: ${id}`);

      const validation = await validateTenant(id);

      if (validation.valid && validation.tenant) {
        setTenant(validation.tenant);
        setIsValid(true);

        // Set tenant in API client for request interception
        apiClient.setTenant(id);

        log.info(`Tenant loaded successfully: ${id}`);
      } else {
        setTenant(null);
        setIsValid(false);
        setError(new Error(validation.message || "Tenant validation failed"));

        log.warn(`Tenant validation failed: ${id}`);
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to load tenant");
      setError(error);
      setTenant(null);
      setIsValid(false);

      log.error(`Error loading tenant: ${id}`, { data: error });
    } finally {
      setIsValidating(false);
    }
  }, []);

  /**
   * Effect to load tenant when tenantId changes
   */
  useEffect(() => {
    if (tenantId) {
      loadTenant(tenantId);
    } else {
      // Clear tenant state
      setTenant(null);
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
      await loadTenant(tenantId);
    }
  }, [tenantId, loadTenant]);

  /**
   * Memoized context value
   */
  const contextValue = useMemo(
    () => ({
      tenantId,
      tenant,
      current: tenant, // Alias for consistency with architecture
      isValidating,
      isValid,
      error,
      setTenantId,
      refetch,
    }),
    [tenantId, tenant, isValidating, isValid, error, refetch],
  );

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}
