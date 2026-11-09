import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Screen-level permissions; row-level buttons always come from `abilities`. */
export function useTaskAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_tasks'),
            canCreate: can('create_tasks'),
            canDelete: can('delete_tasks'),
            canRestore: can('restore_tasks'),
            canForceDelete: can('force_delete_tasks'),
        }),
        [can],
    );
}

export type TaskAccess = ReturnType<typeof useTaskAccess>;
