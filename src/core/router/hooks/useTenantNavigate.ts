/**
 * Tenant-aware navigation hook
 * Wrapper around TanStack Router's useNavigate that automatically includes tenant
 */

import { useNavigate as useRouterNavigate } from "@tanstack/react-router";
import { useTenant } from "@/core/tenant/hooks/useTenant";

export type NavigateOptions = Parameters<
  ReturnType<typeof useRouterNavigate>
>[0];

/**
 * Tenant-aware navigation hook
 * Automatically injects current tenant into navigation
 */
export function useTenantNavigate() {
  const navigate = useRouterNavigate();
  const { tenantId } = useTenant();

  return (options: NavigateOptions) => {
    return navigate({
      ...options,
      params: ((prev: Record<string, unknown>) => ({
        ...prev,
        tenant: tenantId || (prev as any).tenant,
      })) as any,
    });
  };
}
