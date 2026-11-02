import { useMutation } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { managementKeys } from '../api/managementKeys';
import { useManagementCache } from './useManagementCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { ReviewDecision } from '../types/management.types';

/** Approve / reject. The answer is the updated document: replace the cached detail, refresh the rest. */
export function useReviewDocument() {
    const { tenant, queryClient, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: ({ id, decision, note }: { id: number; decision: ReviewDecision; note?: string }) =>
            managementApiService.review(requireTenant(tenant), id, decision, note),
        onSuccess: (updated) => {
            if (tenant) queryClient.setQueryData(managementKeys.detail(tenant, updated.id), updated);
        },
        // 409: somebody decided first — resync either way.
        onSettled: invalidate,
    });
}
