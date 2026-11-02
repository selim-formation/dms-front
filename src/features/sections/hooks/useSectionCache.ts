import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { sectionKeys } from '../api/sectionKeys';
import { departmentKeys } from '@/features/departments/api/departmentKeys';
import { referenceDataKeys } from '@/core/reference-data/api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';

/** A section change also changes departments (sections_count / sections) and the lookups. */
export function useSectionCache() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    const invalidate = useCallback(() => {
        if (!tenant) return;
        queryClient.invalidateQueries({ queryKey: sectionKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: departmentKeys.all(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.sections(tenant) });
        queryClient.invalidateQueries({ queryKey: referenceDataKeys.departments(tenant) });
    }, [tenant, queryClient]);

    return { tenant, queryClient, invalidate };
}
