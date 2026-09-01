/**
 * useDepartments Hook
 * Department lookup list — same "load once, cache long" pattern as useTypes.
 * Shared across features (Teams filter chips, document classification, etc.)
 * so there's one cache entry per tenant instead of one per consumer.
 */

import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ReferenceItem } from '../types/referenceData.types';

export function useDepartments(): { departments: ReferenceItem[]; isLoading: boolean } {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.departments(tenant) : ['reference-data', 'departments', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch departments');
            return getDepartments(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    return {
        departments: query.data ?? [],
        isLoading: query.isLoading,
    };
}
