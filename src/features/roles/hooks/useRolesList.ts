import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rolesApiService } from '../api/rolesApi';
import { roleKeys } from '../api/roleKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { Role, RoleFilters } from '../types/role.types';

const EMPTY: Role[] = [];

/** Paginated, filtered roles. Responses are never cached server-side, so keep staleTime short. */
export function useRolesList(filters: RoleFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? roleKeys.list(tenant, filters) : ['roles', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch roles');
            return rolesApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 15 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        roles: query.data?.data ?? EMPTY,
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
