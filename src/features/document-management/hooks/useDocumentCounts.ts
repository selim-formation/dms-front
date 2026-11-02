import { useQuery } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Tab badges. Independent of search / filters (same audience as the list). */
export function useDocumentCounts() {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? managementKeys.counts(tenant) : ['document-management', 'counts', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch counts');
            return managementApiService.fetchCounts(tenant, signal);
        },
        enabled: !!tenant,
        staleTime: 15 * 1000,
    });

    return { counts: query.data ?? null, isLoading: query.isLoading };
}
