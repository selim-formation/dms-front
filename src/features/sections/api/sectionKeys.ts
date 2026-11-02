/**
 * TanStack Query Key Factory for Sections (tenant-scoped).
 */

import type { SectionFilters } from '../types/section.types';

export const sectionKeys = {
    all: (tenant: string) => ['sections', tenant] as const,
    lists: (tenant: string) => [...sectionKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: SectionFilters) => [...sectionKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...sectionKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...sectionKeys.details(tenant), id] as const,
    stats: (tenant: string) => [...sectionKeys.all(tenant), 'stats'] as const,
};
