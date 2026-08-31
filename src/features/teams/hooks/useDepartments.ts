/**
 * useDepartments Hook
 * Populates the team page's department filter chips. Long stale time —
 * departments rarely change within a session.
 */

import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../api/departmentsApi';
import { departmentKeys } from '../api/teamKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { TeamDepartment } from '../types/team.types';

export function useDepartments(): { departments: TeamDepartment[]; isLoading: boolean } {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? departmentKeys.list(tenant) : ['departments', 'list', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch departments');
            return getDepartments(tenant);
        },
        enabled: !!tenant,
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });

    return {
        departments: query.data ?? [],
        isLoading: query.isLoading,
    };
}
