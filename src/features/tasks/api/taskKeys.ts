/**
 * TanStack Query Key Factory
 *
 * Defines all query keys for the tasks feature. Tenant-scoped so
 * switching tenants can never serve a stale task list from another
 * tenant's cache entry while the real fetch for the new tenant is
 * still in flight.
 */

import type { TaskFilters } from '../types/task.types'

export const taskKeys = {
    all: (tenant: string) => ['tasks', tenant] as const,
    lists: (tenant: string) => [...taskKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: TaskFilters) =>
        [...taskKeys.lists(tenant), { filters }] as const,
    details: (tenant: string) => [...taskKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...taskKeys.details(tenant), id] as const,
}
