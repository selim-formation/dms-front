import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Sections have no permissions of their own: they follow the department ones. */
export function useSectionPermissions() {
    const { can } = usePermissions();

    return useMemo(
        () => ({
            canRead: can('read_departments'),
            canCreate: can('create_departments'),
            canUpdate: can('update_departments'),
            canDelete: can('delete_departments'),
        }),
        [can],
    );
}

export type SectionPermissions = ReturnType<typeof useSectionPermissions>;
