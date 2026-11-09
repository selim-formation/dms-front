import { useMutation } from '@tanstack/react-query';
import { userApiService } from '../api/userApi';
import { useUserCache } from './useUserCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { UserPayload } from '../types/user.types';

/** The answer is the full user: seed the caches with it, then refresh lists. */
export function useCreateUser() {
    const { tenant, replaceUser, invalidate } = useUserCache();

    return useMutation({
        mutationFn: (payload: UserPayload) => userApiService.create(requireTenant(tenant), payload),
        onSuccess: (created) => {
            replaceUser(created);
            invalidate();
        },
    });
}

export function useUpdateUser() {
    const { tenant, replaceUser, invalidate } = useUserCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UserPayload }) =>
            userApiService.update(requireTenant(tenant), id, payload),
        onSuccess: (updated) => {
            replaceUser(updated);
            invalidate();
        },
    });
}
