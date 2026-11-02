import { useQuery } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { sectionKeys } from '../api/sectionKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

export function useSectionStats() {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? sectionKeys.stats(tenant) : ['sections', 'stats', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch section stats');
            return sectionsApiService.fetchStats(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 1000,
    });

    return { stats: query.data ?? null, isLoading: query.isLoading };
}
