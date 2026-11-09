import { useCallback, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { processFilesApiService } from '../api/processFilesApi';
import { managementKeys } from '../api/managementKeys';
import { useManagementCache } from './useManagementCache';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ProcessFilesState, ProcessKind } from '../types/version.types';

const POLL_MS = 3000;
/** The server's storing lock clears itself after 30 minutes; we stop watching sooner. */
const WATCH_MAX_MS = 5 * 60 * 1000;

type Watching = Partial<Record<ProcessKind, number>>;

/**
 * Which process files exist. After a file is attached it only "exists" once the
 * background job has stored it, so the attached kind is watched (polled) until then.
 */
export function useProcessFiles(documentId: number, enabled = true) {
    const tenant = useTenantId();
    const [watching, setWatching] = useState<Watching>({});

    const query = useQuery({
        queryKey: tenant ? managementKeys.processFiles(tenant, documentId) : ['document-management', 'process-files', 'pending'],
        queryFn: ({ signal }) => {
            if (!tenant) throw new Error('Tenant is required');
            return processFilesApiService.fetchState(tenant, documentId, signal);
        },
        enabled: !!tenant && enabled,
        staleTime: 10 * 1000,
        refetchInterval: (q) => {
            const state = q.state.data;
            const now = Date.now();
            const waiting = (Object.entries(watching) as [ProcessKind, number][]).some(
                ([kind, since]) => now - since < WATCH_MAX_MS && !state?.[kind].exists,
            );
            return waiting ? POLL_MS : false;
        },
        retry: (count, error) => {
            const status = (error as { status?: number })?.status;
            return status !== 403 && status !== 404 && count < 2;
        },
    });

    const watch = useCallback((kind: ProcessKind) => setWatching((w) => ({ ...w, [kind]: Date.now() })), []);
    const unwatch = useCallback(
        (kind: ProcessKind) =>
            setWatching((w) => {
                const { [kind]: _removed, ...rest } = w;
                void _removed;
                return rest;
            }),
        [],
    );

    const data: ProcessFilesState | undefined = query.data;
    const isStoring = (kind: ProcessKind): boolean => kind in watching && !data?.[kind].exists;

    return {
        state: data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        watch,
        unwatch,
        isStoring,
    };
}

export function useAttachProcessFile(documentId: number) {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: ({ kind, uploadId }: { kind: ProcessKind; uploadId: string }) =>
            processFilesApiService.attach(requireTenant(tenant), documentId, kind, uploadId),
        onSettled: invalidate,
    });
}

export function useRemoveProcessFile(documentId: number) {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: (kind: ProcessKind) => processFilesApiService.remove(requireTenant(tenant), documentId, kind),
        onSettled: invalidate,
    });
}
