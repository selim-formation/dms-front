/**
 * TanStack Query Key Factory for Teams
 * Tenant-scoped — see favoritesKeys.ts for why (switching tenants must
 * never serve a stale roster from another tenant's cache entry).
 */

import type { TeamListParams } from '../types/team.types';

export const teamKeys = {
    all: (tenant: string) => ['teams', tenant] as const,
    lists: (tenant: string) => [...teamKeys.all(tenant), 'list'] as const,
    list: (tenant: string, params: TeamListParams) =>
        [...teamKeys.lists(tenant), params] as const,
    stats: (tenant: string) => [...teamKeys.all(tenant), 'stats'] as const,
};

export const departmentKeys = {
    all: (tenant: string) => ['departments', tenant] as const,
    list: (tenant: string) => [...departmentKeys.all(tenant), 'list'] as const,
};
