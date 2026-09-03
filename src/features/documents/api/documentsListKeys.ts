/**
 * TanStack Query Key Factory for the /documents list/group/search/reminder
 * endpoints. Tenant-scoped for the same reason as every other feature —
 * switching tenants must never serve another tenant's cached list.
 */

import type { CategorizedFilters, DocumentSearchFilters } from '../types/api.types';

export const documentsListKeys = {
    all: (tenant: string) => ['documents-list', tenant] as const,
    list: (tenant: string, page: number) => [...documentsListKeys.all(tenant), 'list', page] as const,
    recent: (tenant: string, limit?: number) => [...documentsListKeys.all(tenant), 'recent', limit ?? 'default'] as const,
    byTypes: (tenant: string) => [...documentsListKeys.all(tenant), 'by-types'] as const,
    byDepartments: (tenant: string) => [...documentsListKeys.all(tenant), 'by-departments'] as const,
    search: (tenant: string, filters: DocumentSearchFilters) =>
        [...documentsListKeys.all(tenant), 'search', filters] as const,
    categorized: (tenant: string, filters: CategorizedFilters) =>
        [...documentsListKeys.all(tenant), 'categorized', filters] as const,
    reminders: (tenant: string) => [...documentsListKeys.all(tenant), 'reminders'] as const,
    activeReminders: (tenant: string) => [...documentsListKeys.all(tenant), 'active-reminders'] as const,
};
