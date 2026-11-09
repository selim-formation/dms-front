/**
 * TanStack Query Key Factory for company management.
 * Not tenant-scoped: the list is "the companies you belong to", whichever company is open.
 */

import type { CompanyFilters } from '../types/company.types';

export const companyKeys = {
    all: ['company-management'] as const,
    lists: () => [...companyKeys.all, 'list'] as const,
    list: (filters: CompanyFilters) => [...companyKeys.lists(), filters] as const,
    details: () => [...companyKeys.all, 'detail'] as const,
    detail: (id: string) => [...companyKeys.details(), id] as const,
};
