/**
 * TanStack Query Key Factory for reference-data lookup lists.
 * Tenant-scoped for the same reason as every other feature this app —
 * switching tenants must never serve a stale list from another
 * tenant's cache entry.
 */

export const referenceDataKeys = {
    types: (tenant: string) => ['reference-data', tenant, 'types'] as const,
    entities: (tenant: string) => ['reference-data', tenant, 'entities'] as const,
    departments: (tenant: string) => ['reference-data', tenant, 'departments'] as const,
};
