/**
 * useNotifications Hook
 * 
 * TanStack Query hook for fetching notifications with caching
 * Integrates with API service and handles all data states
 */

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '../api/reminders-api';
import { reminderKeys } from '../api/reminderKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { logger } from '@/shared/utils/logger';
import type { Notification } from '../types/reminder.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RefetchFn = () => Promise<any>;

const log = logger.createScoped('useNotifications');

/**
 * Configuration for query options - shorter stale time for notifications
 */
const QUERY_CONFIG = {
    staleTime: 1 * 60 * 1000, // 1 minute - notifications need real-time updates
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

interface UseNotificationsOptions {
    enabled?: boolean;
}

interface UseNotificationsResult {
    notifications: Notification[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: RefetchFn;
    isFetching: boolean;
    isStale: boolean;
}

/**
 * Hook to fetch notifications
 * 
 * @param options - Query options
 * @returns Object with notifications data and state
 */
export function useNotifications(
    options: UseNotificationsOptions = {}
): UseNotificationsResult {
    const { enabled: enabledProp = true } = options;
    const tenant = useTenantId();

    const enabled = enabledProp && !!tenant;

    const query = useQuery({
        queryKey: tenant ? reminderKeys.notifications() : ['notifications', 'pending'],
        queryFn: async () => {
            if (!tenant) {
                log.warn('Tenant is not available for notifications fetch');
                throw new Error('Tenant is required to fetch notifications');
            }

            log.info('Fetching notifications', { tenant });
            return getNotifications(tenant);
        },
        enabled,
        ...QUERY_CONFIG,
    });

    return {
        notifications: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isFetching: query.isFetching,
        isStale: query.isStale,
    };
}
