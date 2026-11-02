import { useMutation } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { useEntityCache } from './useEntityCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

/** Permanent delete — documents lose this entity. */
export function useForceDeleteEntity() {
    const { tenant, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: (id: number) => entitiesApiService.forceDelete(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
