/**
 * TanStack Query Key Factory for storage connections (tenant-scoped).
 */

import type { StorageFilters } from '../types/storage.types';

export const storageKeys = {
    all: (tenant: string) => ['storage-connections', tenant] as const,
    lists: (tenant: string) => [...storageKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: StorageFilters) => [...storageKeys.lists(tenant), filters] as const,
};
