import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Note: permanent delete uses `delete_types` (existing admin-panel rule). */
export function useTypePermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_types'),
            canCreate: can('create_types'),
            canUpdate: can('update_types'),
            canDelete: can('delete_types'),
            canRestore: can('restore_types'),
            canForceDelete: can('delete_types'),
        }),
        [can],
    );
}

export type TypePermissions = ReturnType<typeof useTypePermissions>;
