import { useMemo } from 'react';
import { useUsers } from '@/core/reference-data/hooks/useUsers';
import type { UserItem } from '@/core/reference-data/types/referenceData.types';

const LEADER_ROLES = new Set(['manager', 'head']);

/**
 * Users who work in the chosen departments (responsible) and, among them, the
 * managers / heads (cc). If the users endpoint does not say which departments a
 * user works in, everyone is offered and the server's validation decides.
 */
export function useDepartmentUsers(departmentIds: number[]) {
    const { users, isLoading, isError } = useUsers();

    const inDepartments = useMemo<UserItem[]>(() => {
        if (departmentIds.length === 0) return [];
        const wanted = new Set(departmentIds);
        const knowsDepartments = users.some((u) => u.department_ids.length > 0);
        return knowsDepartments ? users.filter((u) => u.department_ids.some((d) => wanted.has(d))) : users;
    }, [users, departmentIds]);

    const leaders = useMemo(() => {
        const knowsRoles = users.some((u) => u.roles.length > 0);
        return knowsRoles ? inDepartments.filter((u) => u.roles.some((r) => LEADER_ROLES.has(r.toLowerCase()))) : inDepartments;
    }, [inDepartments, users]);

    return { users: inDepartments, leaders, isLoading, isError };
}
