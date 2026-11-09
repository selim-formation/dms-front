import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Screen-level permissions; per-row buttons always come from `abilities`. */
export function useStorageAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_storage_connections'),
            canCreate: can('create_storage_connections'),
            canUpdate: can('update_storage_connections'),
            canTest: can('test_storage_connections'),
            canDelete: can('delete_storage_connections'),
        }),
        [can],
    );
}

export type StorageAccess = ReturnType<typeof useStorageAccess>;
