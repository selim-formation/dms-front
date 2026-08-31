/**
 * Tenant Layout Route
 * Syncs the `$tenant` URL param into TenantProvider and validates it
 * before any nested /$tenant/* route loads.
 */

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import {
  validateTenant,
  tenantValidateQueryKey,
  TENANT_VALIDATE_STALE_TIME,
} from "@/core/tenant/services/tenant.service";

export const Route = createFileRoute("/$tenant")({
  beforeLoad: async ({ params, context }) => {
    const { tenant: tenantCtx, auth, queryClient } = context;

    // Keep the provider (and every useTenant() consumer) in sync with the URL.
    if (tenantCtx.tenantId !== params.tenant) {
      tenantCtx.setTenantId(params.tenant);
    }

    const markValid = () => ({
      tenant: {
        ...tenantCtx,
        tenantId: params.tenant,
        isValid: true,
        isValidating: false,
        error: null,
      },
    });

    // Fast path: provider already validated this exact tenant.
    if (tenantCtx.isValid && tenantCtx.tenantId === params.tenant) {
      return { tenant: tenantCtx };
    }

    // Fast path: /api/me already told us this tenant is one of the
    // user's companies — no need to round-trip /validate at all.
    const isKnownCompany = auth.companies.some(
      (c) => c.slug === params.tenant || c.id === params.tenant,
    );
    if (isKnownCompany) {
      return markValid();
    }

    // Cached fetch — shares a cache entry (staleTime 15s, matching the
    // backend's own /me cache) with TenantProvider, so switching tabs
    // or re-navigating within the same tenant doesn't re-hit /validate.
    const result = await queryClient.fetchQuery({
      queryKey: tenantValidateQueryKey(params.tenant),
      queryFn: () => validateTenant(params.tenant),
      staleTime: TENANT_VALIDATE_STALE_TIME,
    });

    if (result.kind === "not_found") {
      throw redirect({ to: "/", search: { error: "tenant_not_found" } });
    }
    if (result.kind === "access_denied") {
      throw redirect({ to: "/", search: { error: "tenant_access_denied" } });
    }
    if (result.kind !== "valid") {
      throw redirect({ to: "/", search: { error: "invalid_tenant" } });
    }

    return markValid();
  },
  component: () => <Outlet />,
});
