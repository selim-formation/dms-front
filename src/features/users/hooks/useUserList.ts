import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { userApiService } from '../api/userApi';
import { userKeys } from '../api/userKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ManagedUser, UserFilters } from '../types/user.types';

const EMPTY: ManagedUser[] = [];

/** Always paginated; responses are never cached server-side, so keep staleTime short. */
export function useUserList(filters: UserFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? userKeys.list(tenant, filters) : ['user-management', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch users');
            return userApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        users: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
