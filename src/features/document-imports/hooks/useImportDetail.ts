import { useQuery } from '@tanstack/react-query';
import { documentImportsApiService } from '../api/documentImportsApi';
import { importKeys } from '../api/importKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { DETAIL_POLL_MS } from '../utils/importPayload';

/** One import; polls every 3 s only while the server is working (`is_in_progress`). */
export function useImportDetail(id: number) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? importKeys.detail(tenant, id) : ['document-imports', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch an import');
            return documentImportsApiService.fetchOne(tenant, id, signal);
        },
        enabled: !!tenant && Number.isFinite(id),
        refetchInterval: (q) => (q.state.data?.is_in_progress ? DETAIL_POLL_MS : false),
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        item: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
