import { useQuery } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { sectionKeys } from '../api/sectionKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-section fetch (includes documents_count). Pass `null` to stay idle. */
export function useSectionDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? sectionKeys.detail(tenant, id) : ['sections', 'detail', 'pending'],
        queryFn: () => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return sectionsApiService.fetchOne(tenant, id);
        },
        enabled: !!tenant && id !== null,
        staleTime: 30 * 1000,
    });

    return {
        section: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
