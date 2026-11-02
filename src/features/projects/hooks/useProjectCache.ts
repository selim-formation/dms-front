import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { projectKeys } from '../api/projectKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

export function useProjectCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: projectKeys.all(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
