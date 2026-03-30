/**
 * useActiveReminders Hook
 * 
 * TanStack Query hook for fetching active reminders with caching
 * Integrates with API service and handles all data states
 */

import { useQuery } from '@tanstack/react-query';
import { getActiveReminders } from '../api/reminders-api';
import { reminderKeys } from '../api/reminderKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { ReminderDocument } from '../types/reminder.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('useActiveReminders');

/**
 * Configuration for query options - shorter stale time for active reminders
 */
const QUERY_CONFIG = {
    staleTime: 1 * 60 * 1000, // 1 minute - active reminders need fresher data
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseActiveRemindersOptions {
    enabled?: boolean;
}

interface UseActiveRemindersResult {
    reminders: ReminderDocument[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: RefetchFn;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch active reminders
 * 
 * @param options - Query options
 * @returns Object with active reminders data and state
 */
export function useActiveReminders(
    options: UseActiveRemindersOptions = {}
): UseActiveRemindersResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? reminderKeys.active() : ['reminders', 'active', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for active reminders fetch');
                throw new Error('Tenant is required to fetch active reminders');
            }

            log.info('Fetching active reminders', { tenant });
            return getActiveReminders(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        reminders: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
