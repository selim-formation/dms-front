/**
 * TanStack Query Key Factory for Employees (tenant-scoped).
 */

import type { EmployeeFilters } from '../types/employee.types';

export const employeeKeys = {
    all: (tenant: string) => ['employees', tenant] as const,
    lists: (tenant: string) => [...employeeKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: EmployeeFilters) => [...employeeKeys.lists(tenant), filters] as const,
    /** Deleted employee holding a given email (duplicate-email recovery). */
    trashedByEmail: (tenant: string, email: string) => [...employeeKeys.all(tenant), 'trashed-email', email] as const,
};
