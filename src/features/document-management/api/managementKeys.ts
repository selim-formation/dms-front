/**
 * TanStack Query Key Factory for document management (tenant-scoped).
 */

import type { ManagementFilters } from '../types/management.types';

export const managementKeys = {
    all: (tenant: string) => ['document-management', tenant] as const,
    lists: (tenant: string) => [...managementKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: ManagementFilters) => [...managementKeys.lists(tenant), filters] as const,
    counts: (tenant: string) => [...managementKeys.all(tenant), 'counts'] as const,
    details: (tenant: string) => [...managementKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...managementKeys.details(tenant), id] as const,
    versions: (tenant: string, documentId: number) => [...managementKeys.all(tenant), 'versions', documentId] as const,
    processFiles: (tenant: string, documentId: number) => [...managementKeys.all(tenant), 'process-files', documentId] as const,
};
