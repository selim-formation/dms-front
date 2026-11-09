import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Version permissions are separate from the document ones; per-row buttons come from `abilities`. */
export function useVersionAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_versions') && can('read_documents'),
            canCreate: can('create_versions'),
            canUpdate: can('update_versions'),
            canDelete: can('delete_versions'),
        }),
        [can],
    );
}

export type VersionAccess = ReturnType<typeof useVersionAccess>;
