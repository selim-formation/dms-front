import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { roleKeys } from '../api/roleKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/**
 * A role change also changes what its holders may do, so the current user
 * (`GET /api/me`, permissions) is refreshed together with the role queries.
 */
export function useRoleCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: roleKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: ['auth'] });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
