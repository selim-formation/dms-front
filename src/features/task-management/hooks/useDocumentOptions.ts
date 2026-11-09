import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { managementApiService } from '@/features/document-management/api/managementApi';
import { taskKeys } from '../api/taskKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { useDebounce } from '@/shared/hooks/useDebounce';

export interface DocumentOption {
    id: number;
    title: string;
}

const EMPTY: DocumentOption[] = [];
const PAGE_SIZE = 20;

/** Server-side search over documents the user can see (debounced, cached 1 min, only while `enabled`). */
export function useDocumentOptions(search: string, enabled: boolean) {
    const tenant = useTenantId();
    const term = useDebounce(search.trim(), 300);

    const query = useQuery({
        queryKey: tenant ? taskKeys.documentOptions(tenant, term) : ['task-management', 'document-options', 'pending'],
        queryFn: async ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required');
            const res = await managementApiService.fetchList(
                tenant,
                { search: term || undefined, perPage: PAGE_SIZE, sort: '-created_at' },
                signal,
            );
            return res.data.map((d): DocumentOption => ({ id: d.id, title: d.title }));
        },
        enabled: enabled && !!tenant,
        placeholderData: keepPreviousData,
        staleTime: 60 * 1000,
    });

    return { options: query.data ?? EMPTY, isLoading: query.isLoading, isError: query.isError };
}
