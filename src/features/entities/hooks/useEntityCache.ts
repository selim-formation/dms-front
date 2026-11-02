import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { entityKeys } from '../api/entityKeys';
import { referenceDataKeys } from '@/core/reference-data/api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** What a entity change makes stale: this feature's queries + the shared lookup list. */
export function useEntityCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: entityKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.entities(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
