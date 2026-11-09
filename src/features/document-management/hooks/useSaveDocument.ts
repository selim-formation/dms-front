import { useMutation } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useManagementCache } from './useManagementCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { CreateDocumentPayload, DocumentPayload } from '../types/management.types';

/** The answer is the full document (approvals + latest version): seed the detail cache with it. */
export function useCreateDocument() {
    const { tenant, queryClient, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: (payload: CreateDocumentPayload) => managementApiService.create(requireTenant(tenant), payload),
        onSuccess: (created) => {
            if (tenant) queryClient.setQueryData(managementKeys.detail(tenant, created.id), created);
            invalidate();
        },
    });
}

export function useUpdateDocument() {
    const { tenant, queryClient, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: DocumentPayload }) =>
            managementApiService.update(requireTenant(tenant), id, payload),
        onSuccess: (updated) => {
            if (tenant) queryClient.setQueryData(managementKeys.detail(tenant, updated.id), updated);
            invalidate();
        },
    });
}
