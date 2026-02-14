/**
 * Route Builder Utilities
 * Helper functions to build tenant-aware URLs
 */

/**
 * Build a tenant-scoped route path
 */
export function buildRoute(tenantId: string, path: string): string {
  // Remove leading slash if present
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return `/${tenantId}/${normalizedPath}`;
}

/**
 * Build route params with tenant
 */
export function buildRouteParams<T extends Record<string, unknown>>(
  tenantId: string,
  params?: T,
): T & { tenant: string } {
  return {
    ...params,
    tenant: tenantId,
  } as T & { tenant: string };
}

/**
 * Replace tenant placeholder in route path
 */
export function replaceTenantInPath(path: string, tenantId: string): string {
  return path.replace("{tenant}", tenantId);
}

/**
 * Extract tenant from path
 */
export function extractTenantFromPath(path: string): string | null {
  const match = path.match(/^\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Check if path is tenant-scoped
 */
export function isTenantRoute(path: string): boolean {
  // Tenant routes start with /{tenant}/
  return /^\/[^/]+\//.test(path);
}

/**
 * Build API endpoint with tenant
 */
export function buildApiEndpoint(
  endpoint: string,
  tenantId: string,
  params?: Record<string, string>,
): string {
  let url = endpoint.replace("{tenant}", tenantId);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }

  return url;
}
