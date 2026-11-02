/**
 * usePermissionCatalog Hook
 * The tenant's own permissions (role form picker). Rarely changes, so it is
 * cached for a long time and only requested while `enabled` (dialog open).
 */

import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { PermissionItem } from '../types/referenceData.types';

const EMPTY: PermissionItem[] = [];

export function usePermissionCatalog(enabled = true): {
    permissions: PermissionItem[];
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
} {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.permissions(tenant) : ['reference-data', 'permissions', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch permissions');
            return getPermissions(tenant);
        },
        enabled: enabled && !!tenant,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    return {
        permissions: query.data ?? EMPTY,
        isLoading: query.isLoading,
        isError: query.isError,
        refetch: query.refetch,
    };
}
