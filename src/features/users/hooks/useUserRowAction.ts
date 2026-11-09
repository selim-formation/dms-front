/**
 * delete / restore / force delete / activate / deactivate of one user.
 * Delete, restore and force delete move the row out of the current tab, so it is
 * removed optimistically from every cached list page (rolled back on error).
 * Activate / deactivate swap the row with the server's answer instead.
 */
import { useMutation } from '@tanstack/react-query';
import { userApiService } from '../api/userApi';
import { userKeys } from '../api/userKeys';
import { useUserCache } from './useUserCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { UserRowAction, UsersPaginatedData } from '../types/user.types';

const REMOVES_ROW: ReadonlySet<UserRowAction> = new Set(['delete', 'restore', 'force_delete']);

export function useUserRowAction(action: UserRowAction) {
    const { tenant, queryClient, replaceUser, invalidate } = useUserCache();

    return useMutation({
        mutationFn: async (id: number) => {
            const t = requireTenant(tenant);
            switch (action) {
                case 'delete':
                    return void (await userApiService.remove(t, id));
                case 'force_delete':
                    return void (await userApiService.forceDelete(t, id));
                case 'restore':
                    return userApiService.restore(t, id);
                case 'activate':
                    return userApiService.activate(t, id);
                case 'deactivate':
                    return userApiService.deactivate(t, id);
            }
        },
        onMutate: async (id) => {
            if (!tenant || !REMOVES_ROW.has(action)) return { previous: [] };
            await queryClient.cancelQueries({ queryKey: userKeys.lists(tenant) });
            const previous = queryClient.getQueriesData<UsersPaginatedData>({ queryKey: userKeys.lists(tenant) });
            queryClient.setQueriesData<UsersPaginatedData>(
                { queryKey: userKeys.lists(tenant) },
                (old) =>
                    old && {
                        ...old,
                        data: old.data.filter((u) => u.id !== id),
                        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
                    },
            );
            return { previous };
        },
        onSuccess: (result) => {
            if (result) replaceUser(result);
        },
        onError: (_e, _id, ctx) => {
            ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: invalidate,
    });
}
