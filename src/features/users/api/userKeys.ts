/**
 * TanStack Query Key Factory for user management (tenant-scoped).
 */

import type { UserFilters } from '../types/user.types';

export const userKeys = {
    all: (tenant: string) => ['user-management', tenant] as const,
    lists: (tenant: string) => [...userKeys.all(tenant), 'list'] as const,
    list: (tenant: string, filters: UserFilters) => [...userKeys.lists(tenant), filters] as const,
    details: (tenant: string) => [...userKeys.all(tenant), 'detail'] as const,
    detail: (tenant: string, id: number) => [...userKeys.details(tenant), id] as const,
    roleOptions: (tenant: string) => [...userKeys.all(tenant), 'role-options'] as const,
};
