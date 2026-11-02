import { useMutation } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { useTypeCache } from './useTypeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

/** Permanent delete — documents lose this type. */
export function useForceDeleteType() {
    const { tenant, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: (id: number) => typesApiService.forceDelete(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
