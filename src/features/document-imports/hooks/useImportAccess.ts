import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Imports use the document permissions: there is no separate "import" permission. */
export function useImportAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_documents'),
            canCreate: can('create_documents'),
            canRollback: can('delete_documents'),
        }),
        [can],
    );
}

export type ImportAccess = ReturnType<typeof useImportAccess>;
