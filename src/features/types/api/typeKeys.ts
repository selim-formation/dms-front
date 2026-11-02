/**
 * TanStack Query Key Factory for Types (tenant-scoped).
 */

import type { TypeFilters } from '../types/type.types';

export const typeKeys = {
    all: (tenant: string) => ['types', tenant] as const,
    lists: (tenant: string) => [...typeKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: TypeFilters) => [...typeKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...typeKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...typeKeys.details(tenant), id] as const,
};
