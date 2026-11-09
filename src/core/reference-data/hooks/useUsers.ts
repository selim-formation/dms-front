/**
 * useUsers Hook
 * Tenant users for the document form (responsible / cc). Lazy: only requested
 * while `enabled`, cached for 5 minutes.
 */

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/referenceDataApi';
import { referenceDataKeys } from '../api/referenceDataKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { UserItem } from '../types/referenceData.types';

const EMPTY: UserItem[] = [];

export function useUsers(enabled = true): { users: UserItem[]; isLoading: boolean; isError: boolean } {
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? referenceDataKeys.users(tenant) : ['reference-data', 'users', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch users');
            return getUsers(tenant);
        },
        enabled: enabled && !!tenant,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });

    return { users: query.data ?? EMPTY, isLoading: query.isLoading, isError: query.isError };
}
