import { useMutation } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { useTypeCache } from './useTypeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

export function useRestoreType() {
    const { tenant, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: (id: number) => typesApiService.restore(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
