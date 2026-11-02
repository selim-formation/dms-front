/**
 * TanStack Query Key Factory for Entities (tenant-scoped).
 */

import type { EntityFilters } from '../types/entity.types';

export const entityKeys = {
    all: (tenant: string) => ['entities', tenant] as const,
    lists: (tenant: string) => [...entityKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: EntityFilters) => [...entityKeys.lists(tenant), filters] as const,
    stats: (tenant: string) => [...entityKeys.all(tenant), 'stats'] as const,
    details: (tenant: string) => [...entityKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...entityKeys.details(tenant), id] as const,
};
