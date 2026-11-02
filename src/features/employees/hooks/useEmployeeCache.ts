import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { employeeKeys } from '../api/employeeKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

export function useEmployeeCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: employeeKeys.all(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
