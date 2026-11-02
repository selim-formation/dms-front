import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { departmentKeys } from '../api/departmentKeys';
import { referenceDataKeys } from '@/core/reference-data/api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/**
 * One place that knows what a department/section change makes stale:
 * this feature's queries AND the shared lookup lists used by filters/dropdowns.
 */
export function useDepartmentCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: departmentKeys.all(tenant) });
        // Moving sections through a department changes the Sections list too.
        queryClient.invalidateQueries({ queryKey: ['sections', tenant] });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.departments(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.sections(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}

export function requireTenant(tenant: string | null): string {
    if (!tenant) throw new Error('Tenant is required');
    return tenant;
}
