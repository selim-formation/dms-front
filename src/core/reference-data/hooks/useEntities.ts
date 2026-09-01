/**
 * useEntities Hook
 * Related-entity lookup list — same "load once, cache long" pattern as useTypes.
 */

import { useQuery } from '@tanstack/react-query';
import { getEntities } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ReferenceItem } from '../types/referenceData.types';

export function useEntities(): { entities: ReferenceItem[]; isLoading: boolean } {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.entities(tenant) : ['reference-data', 'entities', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch entities');
            return getEntities(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    return {
        entities: query.data ?? [],
        isLoading: query.isLoading,
    };
}
