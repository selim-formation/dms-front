import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { storageKeys } from '../api/storageKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** Every action changes status / default for the whole list, so all pages refresh together. */
export function useStorageCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: storageKeys.all(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
