import { useQuery } from '@tanstack/react-query';
import { userApiService } from '../api/userApi';
import { userKeys } from '../api/userKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Lazy single-user fetch (trashed users can be opened). Pass `null` to stay idle. */
export function useUserDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? userKeys.detail(tenant, id) : ['user-management', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return userApiService.fetchOne(tenant, id, signal);
        },
        enabled: !!tenant && id !== null,
        staleTime: 10 * 1000,
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
