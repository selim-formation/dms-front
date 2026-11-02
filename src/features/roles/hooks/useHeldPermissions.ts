import { useMemo } from 'react';
import { usePermissions } from '@/core/auth/hooks/usePermissions';

/** Names of the permissions the current user holds ("you can only grant what you hold"). */
export function useHeldPermissions(): ReadonlySet<string> {
    const { permissions } = usePermissions();
    return useMemo(() => new Set(permissions), [permissions]);
}
