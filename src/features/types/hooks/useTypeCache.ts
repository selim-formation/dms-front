import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { typeKeys } from '../api/typeKeys';
import { referenceDataKeys } from '@/core/reference-data/api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** What a type change makes stale: this feature's queries + the shared lookup list. */
export function useTypeCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: typeKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.types(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
