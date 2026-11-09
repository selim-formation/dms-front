import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/**
 * Screen-level permissions, as held in the company that is currently open.
 * Row-level buttons always come from `abilities` (checked per company by the server).
 */
export function useCompanyAccess() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_tenants'),
            canCreate: can('create_tenants'),
            canDelete: can('delete_tenants'),
            canRestore: can('restore_tenants'),
            canForceDelete: can('force_delete_tenants'),
        }),
        [can],
    );
}

export type CompanyAccess = ReturnType<typeof useCompanyAccess>;
