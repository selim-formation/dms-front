import { useQuery } from '@tanstack/react-query';
import { versionsApiService } from '../api/versionsApi';
import { managementKeys } from '../api/managementKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { isVersionBusy } from '../utils/versionFields';
import type { DocumentVersion } from '../types/version.types';

const POLL_MS = 3000;
const EMPTY: DocumentVersion[] = [];

/** Versions of one document; polls while any file is still being moved into storage. */
export function useDocumentVersions(documentId: number, enabled = true) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? managementKeys.versions(tenant, documentId) : ['document-management', 'versions', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required');
            return versionsApiService.fetchList(tenant, documentId, signal);
        },
        enabled: !!tenant && enabled,
        staleTime: 10 * 1000,
        refetchInterval: (q) => (q.state.data?.some((v) => isVersionBusy(v.upload_status)) ? POLL_MS : false),
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    return {
        versions: query.data ?? EMPTY,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
