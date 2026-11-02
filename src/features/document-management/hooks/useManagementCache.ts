import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { managementKeys } from '../api/managementKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Any change moves documents between tabs, so lists, counts and details refresh together. */
export function useManagementCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: managementKeys.all(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
