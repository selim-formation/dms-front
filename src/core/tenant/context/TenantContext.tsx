/**
 * Tenant Context
 * Provides tenant state throughout the application
 */

import { createContext } from "react";
import type { TenantContextValue } from "../types";

/**
 * Default context value
 */
const defaultValue: TenantContextValue = {
  tenantId: null,
  tenant: null,
  current: null,
  isValidating: false,
  isValid: false,
  error: null,
  setTenantId: () => {
    throw new Error("TenantProvider not initialized");
  },
  refetch: async () => {
    throw new Error("TenantProvider not initialized");
  },
};

/**
 * Tenant Context
 */
export const TenantContext = createContext<TenantContextValue>(defaultValue);
