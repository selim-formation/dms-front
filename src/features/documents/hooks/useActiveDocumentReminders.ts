/**
 * useActiveDocumentReminders Hook
 * GET /documents/active-reminders — reminder window currently active, or
 * already overdue. Use this for a "needs attention now" badge/list.
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ApiDocument } from '../types/api.types';

interface UseActiveDocumentRemindersOptions {
    enabled?: boolean;
}

interface UseActiveDocumentRemindersResult {
    documents: ApiDocument[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
}

export function useActiveDocumentReminders(
    options: UseActiveDocumentRemindersOptions = {},
): UseActiveDocumentRemindersResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant
            ? documentsListKeys.activeReminders(tenant)
            : ['documents-list', 'active-reminders', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch active reminders');
            return documentsListApiService.fetchActiveReminders(tenant);
        },
        enabled: enabledProp && !!tenant,
        staleTime: 20 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });

    return {
        documents: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}
