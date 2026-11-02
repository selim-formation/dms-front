import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Backend permission names (see DepartmentPolicy). Memoised so consumers stay stable. */
export function useDepartmentPermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_departments'),
            canCreate: can('create_departments'),
            canUpdate: can('update_departments'),
            canDelete: can('delete_departments'),
            canRestore: can('restore_departments'),
            canForceDelete: can('force_delete_departments'),
        }),
        [can],
    );
}

export type DepartmentPermissions = ReturnType<typeof useDepartmentPermissions>;
