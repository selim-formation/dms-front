import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

export function useProjectPermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_projects'),
            canCreate: can('create_projects'),
            canUpdate: can('update_projects'),
            canDelete: can('delete_projects'),
            canRestore: can('restore_projects'),
            canForceDelete: can('force_delete_projects'),
        }),
        [can],
    );
}

export type ProjectPermissions = ReturnType<typeof useProjectPermissions>;
