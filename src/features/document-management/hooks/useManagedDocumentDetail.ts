import { useQuery } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { UPLOAD_IN_PROGRESS } from '../types/management.types';

/** Lazy single-document fetch (approvals + latest version). Pass `null` to stay idle. */
export function useManagedDocumentDetail(id: number | null) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant && id !== null ? managementKeys.detail(tenant, id) : ['document-management', 'detail', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant || id === null) throw new Error('Tenant and id are required');
            return managementApiService.fetchOne(tenant, id, signal);
        },
        enabled: !!tenant && id !== null,
        staleTime: 10 * 1000,
        // Files are moved into storage in the background: poll until none is queued / processing.
        refetchInterval: (q) => (UPLOAD_IN_PROGRESS.has(q.state.data?.latest_version?.upload_status ?? '') ? 3000 : false),
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        document: query.data ?? null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
