import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { sectionKeys } from '../api/sectionKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { SectionFilters } from '../types/section.types';

/** Paginated, filtered sections. staleTime matches the 30s server cache. */
export function useSectionsList(filters: SectionFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? sectionKeys.list(tenant, filters) : ['sections', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch sections');
            return sectionsApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        sections: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
