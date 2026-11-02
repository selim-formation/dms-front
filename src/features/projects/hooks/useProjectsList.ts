import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { projectKeys } from '../api/projectKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ProjectFilters } from '../types/project.types';

/** Paginated, filtered projects. staleTime matches the 30s server cache. */
export function useProjectsList(filters: ProjectFilters) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? projectKeys.list(tenant, filters) : ['projects', 'list', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch projects');
            return projectsApiService.fetchList(tenant, filters, signal);
        },
        enabled: !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 30 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    return {
        projects: query.data?.data ?? [],
        meta: query.data?.meta ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
