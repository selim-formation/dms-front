import { useMutation } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { useEntityCache } from './useEntityCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EntityBulkAction } from '../types/entity.types';

export function useBulkEntities() {
    const { tenant, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: EntityBulkAction; ids: number[] }) =>
            entitiesApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
