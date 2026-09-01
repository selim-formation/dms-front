/**
 * useTypes Hook
 * Document type lookup list — loaded once, cached long (rarely changes,
 * admin-managed). Matches the "load once at tenant boot" pattern the
 * backend recommends for all three reference-data lists.
 */

import { useQuery } from '@tanstack/react-query';
import { getTypes } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ReferenceItem } from '../types/referenceData.types';

export function useTypes(): { types: ReferenceItem[]; isLoading: boolean } {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.types(tenant) : ['reference-data', 'types', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch types');
            return getTypes(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    return {
        types: query.data ?? [],
        isLoading: query.isLoading,
    };
}
