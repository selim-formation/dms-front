import { useMutation } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { useEntityCache } from './useEntityCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

export function useRestoreEntity() {
    const { tenant, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: (id: number) => entitiesApiService.restore(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
