/**
 * useSections Hook
 * Section lookup list — same "load once, cache long" pattern as useDepartments.
 * `enabled` lets lazy consumers (e.g. the share dialog) skip the request until opened.
 */

import { useQuery } from '@tanstack/react-query';
import { getSections } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ReferenceItem } from '../types/referenceData.types';

export function useSections(enabled = true): {
    sections: ReferenceItem[];
    isLoading: boolean;
    isError: boolean;
} {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.sections(tenant) : ['reference-data', 'sections', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch sections');
            return getSections(tenant);
        },
        enabled: enabled && !!tenant,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    return {
        sections: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
    };
}
