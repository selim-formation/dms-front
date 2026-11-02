import { useMutation } from '@tanstack/react-query';
import { managementApiService } from '../api/managementApi';
import { useManagementCache } from './useManagementCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { BulkAction } from '../types/management.types';

/** All-or-nothing: one document that can't be used makes the server refuse the whole call (422). */
export function useBulkDocuments() {
    const { tenant, invalidate } = useManagementCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: BulkAction; ids: number[] }) =>
            managementApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
