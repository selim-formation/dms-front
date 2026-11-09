/**
 * TanStack Query Key Factory for task management (tenant-scoped).
 */

import type { TaskFilters } from '../types/task.types';

export const taskKeys = {
    all: (tenant: string) => ['task-management', tenant] as const,
    lists: (tenant: string) => [...taskKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: TaskFilters) => [...taskKeys.lists(tenant), filters] as const,
    counts: (tenant: string) => [...taskKeys.all(tenant), 'counts'] as const,
    details: (tenant: string) => [...taskKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...taskKeys.details(tenant), id] as const,
    documentOptions: (tenant: string, search: string) => [...taskKeys.all(tenant), 'document-options', search] as const,
};
