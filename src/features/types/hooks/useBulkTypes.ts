import { useMutation } from '@tanstack/react-query';
import { typesApiService } from '../api/typesApi';
import { useTypeCache } from './useTypeCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';
import type { TypeBulkAction } from '../types/type.types';

export function useBulkTypes() {
    const { tenant, invalidate } = useTypeCache();

    return useMutation({
        mutationFn: ({ action, ids }: { action: TypeBulkAction; ids: number[] }) =>
            typesApiService.bulk(requireTenant(tenant), action, ids),
        onSettled: invalidate,
    });
}
