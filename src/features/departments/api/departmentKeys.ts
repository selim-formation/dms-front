/**
 * TanStack Query Key Factory for Departments (tenant-scoped).
 */

import type { DepartmentFilters } from '../types/department.types';

export const departmentKeys = {
    all: (tenant: string) => ['departments', tenant] as const,
    lists: (tenant: string) => [...departmentKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: DepartmentFilters) =>
        [...departmentKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...departmentKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...departmentKeys.details(tenant), id] as const,
    stats: (tenant: string) => [...departmentKeys.all(tenant), 'stats'] as const,
};
