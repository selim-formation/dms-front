/**
 * Option lists for the filter bar and the form: roles, departments and sections
 * as `{ id, label }`. Departments and sections come from the shared lookup cache
 * (one request per tenant, however many components mount); roles are fetched once
 * here because no lookup exists for them.
 */
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rolesApiService } from '@/features/roles/api/rolesApi';
import { useDepartments } from '@/core/reference-data/hooks/useDepartments';
import { useSections } from '@/core/reference-data/hooks/useSections';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { userKeys } from '../api/userKeys';
import type { UserOption } from '../types/user.types';

const EMPTY: UserOption[] = [];
const byLabel = (a: UserOption, b: UserOption) => a.label.localeCompare(b.label);

export function useRoleOptions(enabled = true) {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? userKeys.roleOptions(tenant) : ['user-management', 'role-options', 'pending'],
        queryFn: async ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required to fetch roles');
            const page = await rolesApiService.fetchList(tenant, { page: 1, perPage: 100, sort: 'name' }, signal);
            return page.data.map<UserOption>((r) => ({ id: r.id, label: r.name })).sort(byLabel);
        },
        enabled: enabled && !!tenant,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    return { roles: query.data ?? EMPTY, isLoading: query.isLoading, isError: query.isError, refetch: query.refetch };
}

export function useDepartmentOptions() {
    const { departments, isLoading } = useDepartments();
    const options = useMemo(
        () => departments.map<UserOption>((d) => ({ id: d.id, label: d.title })).sort(byLabel),
        [departments],
    );
    return { departments: options, isLoading };
}

export function useSectionOptions(enabled = true) {
    const { sections, isLoading, isError } = useSections(enabled);
    const options = useMemo(
        () =>
            sections
                .map<UserOption>((s) => ({ id: s.id, label: s.name ?? s.title, departmentId: s.department_id ?? null }))
                .sort(byLabel),
        [sections],
    );
    return { sections: options, isLoading, isError };
}
