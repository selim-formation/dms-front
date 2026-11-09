/**
 * make default / disable / delete of one connection. Delete removes the row
 * optimistically (rolled back on error); the other two refresh the list, since
 * making a default also changes another row.
 */
import { useMutation } from '@tanstack/react-query';
import { storageApiService } from '../api/storageApi';
import { storageKeys } from '../api/storageKeys';
import { useStorageCache } from './useStorageCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { StorageActionKind, StoragePaginatedData } from '../types/storage.types';

export function useStorageAction(kind: StorageActionKind) {
    const { tenant, queryClient, invalidate } = useStorageCache();

    return useMutation({
        mutationFn: async (id: number) => {
            const t = requireTenant(tenant);
            if (kind === 'default') await storageApiService.setDefault(t, id);
            else if (kind === 'disable') await storageApiService.disable(t, id);
            else await storageApiService.remove(t, id);
        },
        onMutate: async (id) => {
            if (!tenant || kind !== 'delete') return { previous: [] };
            await queryClient.cancelQueries({ queryKey: storageKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<StoragePaginatedData>({ queryKey: storageKeys.lists(tenant) });
            queryClient.setQueriesData<StoragePaginatedData>(
                { queryKey: storageKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((c) => c.id !== id),
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
