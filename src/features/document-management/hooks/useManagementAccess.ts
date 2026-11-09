import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Tab-level permissions; row-level buttons always come from `abilities`. */
export function useManagementAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_documents'),
            canCreate: can('create_documents'),
            canDelete: can('delete_documents'),
            canRestore: can('restore_documents'),
            canForceDelete: can('force_delete_documents'),
        }),
        [can],
    );
}

export type ManagementAccess = ReturnType<typeof useManagementAccess>;
