import { useMutation } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { useProjectCache } from './useProjectCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

export function useRestoreProject() {
    const { tenant, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: (id: number) => projectsApiService.restore(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
