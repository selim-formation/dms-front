/**
 * useDocumentReminders Hook
 * GET /documents/reminder — docs with a reminder CONFIGURED (not
 * necessarily firing yet). Use useActiveDocumentReminders for that.
 */

import { useQuery } from '@tanstack/react-query';
import { documentsListApiService } from '../api/documentsListApi';
import { documentsListKeys } from '../api/documentsListKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import type { ApiDocument } from '../types/api.types';

interface UseDocumentRemindersOptions {
    enabled?: boolean;
}

interface UseDocumentRemindersResult {
    documents: ApiDocument[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refetch: () => Promise<any>;
}

export function useDocumentReminders(
    options: UseDocumentRemindersOptions = {},
): UseDocumentRemindersResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const query = useQuery({
        queryKey: tenant ? documentsListKeys.reminders(tenant) : ['documents-list', 'reminders', 'pending'],
        queryFn: () => {
            if (!tenant) throw new Error('Tenant is required to fetch reminders');
            return documentsListApiService.fetchReminders(tenant);
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
