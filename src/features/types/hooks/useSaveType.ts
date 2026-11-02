import { useMutation } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { useTypeCache } from './useTypeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TypePayload } from '../types/type.types';

export function useCreateType() {
    const { tenant, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: (payload: TypePayload) => typesApiService.create(requireTenant(tenant), payload),
        onSuccess: invalidate,
    });
}

export function useUpdateType() {
    const { tenant, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: TypePayload }) =>
            typesApiService.update(requireTenant(tenant), id, payload),
        onSuccess: invalidate,
    });
}
