/**
 * useReminders Hook
 * 
 * TanStack Query hook for fetching all reminders with caching
 * Integrates with API service and handles all data states
 */

import { useQuery } from '@tanstack/react-query';
import { getAllReminders } from '../api/reminders-api';
import { reminderKeys } from '../api/reminderKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { ReminderDocument } from '../types/reminder.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('useReminders');

/**
 * Configuration for query options
 */
const QUERY_CONFIG = {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseRemindersOptions {
    enabled?: boolean;
}

interface UseRemindersResult {
    reminders: ReminderDocument[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: RefetchFn;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch all reminders
 * 
 * @param options - Query options
 * @returns Object with reminders data and state
 */
export function useReminders(
    options: UseRemindersOptions = {}
): UseRemindersResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? reminderKeys.allReminders() : ['reminders', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for reminders fetch');
                throw new Error('Tenant is required to fetch reminders');
            }

            log.info('Fetching all reminders', { tenant });
            return getAllReminders(tenant);
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
