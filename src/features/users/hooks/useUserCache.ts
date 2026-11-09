import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { userKeys } from '../api/userKeys';
import { referenceDataKeys } from '@/core/reference-data/api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ManagedUser, UsersPaginatedData } from '../types/user.types';

/**
 * One place that knows what a user change makes stale: this feature's queries,
 * the shared users picker list and `/api/me` (the user may have edited themselves).
 */
export function useUserCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: userKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.users(tenant) });
        queryClient.invalidateQueries({ queryKey: ['auth'] });
    }, [tenant, queryClient]);

    /** Swap one user in every cached list page and the detail cache (answers of save / status calls). */
    const replaceUser = useCallback(
        (user: ManagedUser) => {
            if (!tenant) return;
            queryClient.setQueryData(userKeys.detail(tenant, user.id), user);
            queryClient.setQueriesData<UsersPaginatedData>(
                { queryKey: userKeys.lists(tenant) },
                (old) => old && { ...old, data: old.data.map((u) => (u.id === user.id ? user : u)) },
            );
        },
        [tenant, queryClient],
    );

    return { tenant, queryClient, invalidate, replaceUser };
}
