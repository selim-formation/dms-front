/**
 * useTenantValidation Hook
 * Provides tenant validation utilities
 */

import { useTenant } from "./useTenant";

interface TenantValidationResult {
  isLoading: boolean;
  isValid: boolean;
  isInvalid: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for tenant validation state
 */
export function useTenantValidation(): TenantValidationResult {
  const { isValidating, isValid, error, refetch } = useTenant();

  return {
    isLoading: isValidating,
    isValid,
    isInvalid: !isValidating && !isValid,
    error,
    refetch,
  };
}
