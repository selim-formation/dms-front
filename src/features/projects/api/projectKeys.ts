/**
 * TanStack Query Key Factory for Projects (tenant-scoped).
 */

import type { ProjectFilters } from '../types/project.types';

export const projectKeys = {
    all: (tenant: string) => ['projects', tenant] as const,
    lists: (tenant: string) => [...projectKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: ProjectFilters) => [...projectKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...projectKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...projectKeys.details(tenant), id] as const,
};
