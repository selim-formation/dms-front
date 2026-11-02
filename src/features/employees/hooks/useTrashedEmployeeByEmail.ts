import { useQuery } from '@tanstack/react-query';
import { employeesApiService } from '../api/employeesApi';
import { employeeKeys } from '../api/employeeKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { Employee } from '../types/employee.types';

/**
 * A deleted employee still holds its email, so a duplicate-email 422 may be
 * recoverable by restoring it. Only runs when `enabled` (after that 422).
 */
export function useTrashedEmployeeByEmail(email: string, enabled: boolean) {
    const tenant = useTenantId();
    const needle = email.trim().toLowerCase();

    const query = useQuery({
        queryKey: tenant ? employeeKeys.trashedByEmail(tenant, needle) : ['employees', 'trashed-email', 'pending'],
        queryFn: async ({ signal }): Promise<Employee | null> => {
            if (!tenant) return null;
            const res = await employeesApiService.fetchList(
                tenant,
                { search: needle, trashed: 'only', perPage: 10 },
                signal,
            );
            return res.data.find((e) => e.email.toLowerCase() === needle) ?? null;
        },
        enabled: enabled && !!tenant && needle.length > 0,
        staleTime: 0,
    });

    return query.data ?? null;
}
