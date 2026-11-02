/**
 * TanStack Query Key Factory for document imports (tenant-scoped).
 */

import type { ImportFilters, RowFilters } from '../types/import.types';

export const importKeys = {
    all: (tenant: string) => ['document-imports', tenant] as const,
    lists: (tenant: string) => [...importKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: ImportFilters) => [...importKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...importKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...importKeys.details(tenant), id] as const,
    rows: (tenant: string, id: number, filters: RowFilters, status: string) =>
        [...importKeys.detail(tenant, id), 'rows', status, filters] as const,
};
