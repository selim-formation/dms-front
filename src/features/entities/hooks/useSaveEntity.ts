import { useMutation } from '@tanstack/react-query';
import { entitiesApiService } from '../api/entitiesApi';
import { useEntityCache } from './useEntityCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { EntityPayload } from '../types/entity.types';

export function useCreateEntity() {
    const { tenant, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: (payload: EntityPayload) => entitiesApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateEntity() {
    const { tenant, invalidate } = useEntityCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: EntityPayload }) =>
            entitiesApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
