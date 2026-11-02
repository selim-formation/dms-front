import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Role permission names are singular (`read_role`, not `read_roles`). */
export function useRoleAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_role'),
            canCreate: can('create_role'),
            canUpdate: can('update_role'),
            canDelete: can('delete_role'),
        }),
        [can],
    );
}

export type RoleAccess = ReturnType<typeof useRoleAccess>;
