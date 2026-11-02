import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Permanent delete needs its own `force_delete_entities` permission. */
export function useEntityPermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_entities'),
            canCreate: can('create_entities'),
            canUpdate: can('update_entities'),
            canDelete: can('delete_entities'),
            canRestore: can('restore_entities'),
            canForceDelete: can('force_delete_entities'),
        }),
        [can],
    );
}

export type EntityPermissions = ReturnType<typeof useEntityPermissions>;
