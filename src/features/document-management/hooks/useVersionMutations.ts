import { useMutation } from '@tanstack/react-query';
import { versionsApiService } from '../api/versionsApi';
import { managementKeys } from '../api/managementKeys';
import { useManagementCache } from './useManagementCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { AddVersionPayload, DocumentVersion, UpdateVersionPayload } from '../types/version.types';

/** Add (renewal) a version. Versions can be added to an approved document too. */
export function useAddVersion(documentId: number) {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: (payload: AddVersionPayload) => versionsApiService.add(requireTenant(tenant), documentId, payload),
        onSettled: invalidate,
    });
}

export function useUpdateVersion(documentId: number) {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: ({ versionId, payload }: { versionId: number; payload: UpdateVersionPayload }) =>
            versionsApiService.update(requireTenant(tenant), documentId, versionId, payload),
        onSettled: invalidate,
    });
}

/** Optimistic removal from the cached list; rolled back on error. */
export function useDeleteVersion(documentId: number) {
    const { tenant, queryClient, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: (versionId: number) => versionsApiService.remove(requireTenant(tenant), documentId, versionId),
        onMutate: async (versionId) => {
            if (!tenant) return { previous: undefined };
            const key = managementKeys.versions(tenant, documentId);
            await queryClient.cancelQueries({ queryKey: key });
            const previous = queryClient.getQueryData<DocumentVersion[]>(key);
            queryClient.setQueryData<DocumentVersion[]>(key, (old) => old?.filter((v) => v.id !== versionId));
            return { previous };
        },
        onError: (_e, _id, ctx) => {
            if (tenant && ctx?.previous) queryClient.setQueryData(managementKeys.versions(tenant, documentId), ctx.previous);
        },
        onSettled: invalidate,
    });
}

/** All or nothing: a 422 names every version that blocked it. */
export function useBulkDeleteVersions(documentId: number) {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: (ids: number[]) => versionsApiService.bulkRemove(requireTenant(tenant), documentId, ids),
        onSettled: invalidate,
    });
}
