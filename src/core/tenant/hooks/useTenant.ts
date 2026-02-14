/**
 * useTenant Hook
 * Access tenant context in components
 */

import { useContext } from "react";
import { TenantContext } from "../context/TenantContext";
import { TenantContextValue } from "../types";

/**
 * Hook to access tenant context
 * Throws error if used outside TenantProvider
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (!context) {
    throw new Error("useTenant must be used within TenantProvider");
  }

  return context;
}

/**
 * Hook to get tenant ID
 * Convenient shorthand for accessing just the tenant ID
 */
export function useTenantId(): string | null {
  const { tenantId } = useTenant();
  return tenantId;
}

/**
 * Hook to check if tenant is valid
 */
export function useIsTenantValid(): boolean {
  const { isValid } = useTenant();
  return isValid;
}
