import { useMutation } from '@tanstack/react-query';
import { projectsApiService } from '../api/projectsApi';
import { useProjectCache } from './useProjectCache';
import { requireTenant } from '@/features/departments/hooks/useDepartmentCache';

/** Permanent delete — also removes the project file. */
export function useForceDeleteProject() {
    const { tenant, invalidate } = useProjectCache();

    return useMutation({
        mutationFn: (id: number) => projectsApiService.forceDelete(requireTenant(tenant), id),
        onSettled: invalidate,
    });
}
