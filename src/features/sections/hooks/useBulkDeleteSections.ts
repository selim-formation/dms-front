import { useMutation } from '@tanstack/react-query';
import { sectionsApiService } from '../api/sectionsApi';
import { useSectionCache } from './useSectionCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

export function useBulkDeleteSections() {
    const { tenant, invalidate } = useSectionCache();

    return useMutation({
        mutationFn: (ids: number[]) => sectionsApiService.bulkDelete(requireTenant(tenant), ids),
        onSettled: invalidate,
    });
}
