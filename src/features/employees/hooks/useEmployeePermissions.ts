import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Permanent delete needs its own `force_delete_employees` permission. */
export function useEmployeePermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_employees'),
            canCreate: can('create_employees'),
            canUpdate: can('update_employees'),
            canDelete: can('delete_employees'),
            canRestore: can('restore_employees'),
            canForceDelete: can('force_delete_employees'),
        }),
        [can],
    );
}

export type EmployeePermissions = ReturnType<typeof useEmployeePermissions>;
