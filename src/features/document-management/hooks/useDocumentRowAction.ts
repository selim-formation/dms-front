/**
 * delete / restore / force delete of one document, with optimistic removal from
 * every cached list page (each of these moves the row out of the current tab);
 * rolled back on error. Counts and details are refreshed afterwards.
 */
import { useMutation } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useManagementCache } from './useManagementCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ManagementPaginatedData } from '../types/management.types';

export type RowAction = 'delete' | 'restore' | 'force_delete';

export function useDocumentRowAction(action: RowAction) {
    const { tenant, queryClient, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: async (id: number) => {
            const t = requireTenant(tenant);
            if (action === 'delete') await managementApiService.remove(t, id);
            else if (action === 'restore') await managementApiService.restore(t, id);
            else await managementApiService.forceDelete(t, id);
        },
        onMutate: async (id) => {
            if (!tenant) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: managementKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<ManagementPaginatedData>({ queryKey: managementKeys.lists(tenant) });
            queryClient.setQueriesData<ManagementPaginatedData>(
                { queryKey: managementKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((d) => d.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
