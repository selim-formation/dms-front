/**
 * TanStack Query Key Factory for Roles (tenant-scoped).
 */

import type { RoleFilters } from '../types/role.types';

export const roleKeys = {
    all: (tenant: string) => ['roles', tenant] as const,
    lists: (tenant: string) => [...roleKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: RoleFilters) => [...roleKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...roleKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...roleKeys.details(tenant), id] as const,
};
