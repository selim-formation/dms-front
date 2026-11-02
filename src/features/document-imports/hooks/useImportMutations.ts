import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentImportsApiService } from '../api/documentImportsApi';
import { importKeys } from '../api/importKeys';
import { useTenantId } from '@/core/tenant/hooks/useTenant';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import { saveBlob } from '../utils/importPayload';
import type { CreateImportPayload, ImportAction } from '../types/import.types';

/** The upload feeds exactly one import, so creating never retries automatically. */
export function useCreateImport() {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateImportPayload) => documentImportsApiService.create(requireTenant(tenant), payload),
        onSuccess: (created) => {
            if (!tenant) return;
            queryClient.setQueryData(importKeys.detail(tenant, created.id), created);
            queryClient.invalidateQueries({ queryKey: importKeys.lists(tenant) });
        },
    });
}

/** commit / retry / rollback answer with the updated import: replace the cached copy, keep polling. */
export function useImportAction(action: ImportAction) {
    const tenant = useTenantId();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => documentImportsApiService.act(requireTenant(tenant), id, action),
        onSuccess: (updated) => {
            if (!tenant) return;
            queryClient.setQueryData(importKeys.detail(tenant, updated.id), updated);
            queryClient.invalidateQueries({ queryKey: importKeys.lists(tenant) });
        },
        // 409 means somebody else changed it: resync either way.
        onError: (_e, id) => {
            if (tenant) queryClient.invalidateQueries({ queryKey: importKeys.detail(tenant, id) });
        },
    });
}

export function useDownloadProblems() {
    const tenant = useTenantId();
    return useMutation({
        mutationFn: async (id: number) => {
            saveBlob(await documentImportsApiService.downloadProblems(requireTenant(tenant), id), `import-${id}-problems.csv`);
        },
    });
}

export function useDownloadManifestTemplate() {
    const tenant = useTenantId();
    return useMutation({
        mutationFn: async () => {
            saveBlob(await documentImportsApiService.downloadManifestTemplate(requireTenant(tenant)), 'manifest-template.csv');
        },
    });
}
