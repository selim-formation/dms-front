import { useQuery } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { entityKeys } from '../api/entityKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Counters (active total, with image, trashed). Cached 30s like the server. */
export function useEntityStats() {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? entityKeys.stats(tenant) : ['entities', 'stats', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch entity stats');
            return entitiesApiService.fetchStats(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 1000,
    });

    return { stats: query.data ?? null, isLoading: query.isLoading };
}
