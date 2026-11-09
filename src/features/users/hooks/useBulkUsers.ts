import { useMutation } from '@tanstack/react-query';
import { userApiService } from '../api/userApi';
import { useUserCache } from './useUserCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { UserBulkAction } from '../types/user.types';

/** All-or-nothing: one user that can't be used makes the server refuse the whole call (422 `errors.ids`). */
export function useBulkUsers() {
    const { tenant, invalidate } = useUserCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: UserBulkAction; ids: number[] }) =>
            userApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
