import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Screen-level permissions; row-level buttons always come from `abilities`. */
export function useUserAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_users'),
            canCreate: can('create_users'),
            canUpdate: can('update_users'),
            canDelete: can('delete_users'),
            canRestore: can('restore_users'),
            canForceDelete: can('force_delete_users'),
            canToggleStatus: can('can_active_users'),
        }),
        [can],
    );
}

export type UserAccess = ReturnType<typeof useUserAccess>;
